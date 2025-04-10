from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from geopy.geocoders import Nominatim
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import joblib
import pandas as pd
import joblib
import os
import requests
from io import BytesIO


load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

pipeline = joblib.load("parking_model.pkl")
parkingData = pd.read_csv("cleaned_merged_parking_data.csv")
geolocator = Nominatim(user_agent="my_geocoder")

GOOGLE_KEY = os.getenv("GOOGLE_KEY")
url = f"https://tile.googleapis.com/v1/createSession?key={GOOGLE_KEY}"
headers = {
    "Content-Type" : "application/json"
}

data = {
    "mapType": "roadmap",
    "language": "en-US",
    "region" : "US"
}
response = requests.post(url, json=data, headers=headers)
response_data = response.json()
SESSION_KEY = response_data.get("session")
print(SESSION_KEY)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    latitude = db.Column(db.String(50), nullable = False )
    longitude = db.Column(db.String(50), nullable = False )
    foundParking = db.Column(db.Boolean, nullable = False, default = False)

    def to_dict(self):
        return{
            "id": self.id,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "foundParking": self.foundParking
        }
    
with app.app_context():
    db.create_all()
    
@app.route("/api/feedback", methods = ["POST"])
def set_feedback():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    foundParking = request.args.get("foundParking", type=int)

    if foundParking == 1:
        foundParking = True
    else:
        foundParking = False

    newReview = Review(latitude = lat, longitude = lon, foundParking = foundParking)
    db.session.add(newReview)
    db.session.commit()

    return jsonify({"message": "Success"})


@app.route("/api/getCoords", methods=["GET"])
def get_coords():
    address = request.args.get("address")
    print("Received address:", address)
    location = geolocator.geocode(address)

    if location:
        print("Found latitude:", location.latitude)
        return jsonify({"lat": location.latitude, "long": location.longitude})
    else:
        print("No location found for:", address)
        return jsonify({"message": "error finding coordinates for address"})
    
@app.route("/api/findParking" , methods = ["POST"])
def get_parking():
    feature_columns = ["ParkingTimeLimitCategory", "ParkingCategory", "HotOs", "Hour", "Month", "Season", "Longitude", "Latitude"]

    data = request.get_json()

    # User provided inputs
    user_lat = float(data.get("lat"))
    user_lon = float(data.get("long"))
    user_HotOs = data.get("isWeekend")
    user_Hour = float(data.get("hour"))
    user_Month = float(data.get("month"))

    if user_Month in [1, 2, 12]:
        user_Season = 1
    elif user_Month in [3, 4, 5]:
        user_Season = 2
    elif user_Month in [6, 7, 8]:
        user_Season = 3
    elif user_Month in [9, 10, 11]:
        user_Season = 4
    else:
        # Optional: Handle unexpected month values
        user_Season = None


    # Use NearestNeighbors to find candidate parking spots near the user's location
    parking_coords = parkingData[['Latitude', 'Longitude']].values
    nbrs = NearestNeighbors(n_neighbors=1200, algorithm='ball_tree').fit(parking_coords)
    distances, indices = nbrs.kneighbors(np.array([[user_lat, user_lon]]))

    # Get candidate parking spots from the dataset (do not drop duplicates)
    candidate_spots = parkingData.iloc[indices[0]].copy()

    # Override the candidate records with the user-provided temporal info
    candidate_spots['HotOs'] = user_HotOs
    candidate_spots['Hour'] = user_Hour
    candidate_spots['Month'] = user_Month
    candidate_spots['Season'] = user_Season

    # Prepare the features for prediction
    X_candidates = candidate_spots[feature_columns]

    # Predict the occupancy ratio for these candidate spots
    predicted_ratios = pipeline.predict(X_candidates)
    candidate_spots['PredictedOccupancyRatio'] = predicted_ratios

    # Now, group by the location (Latitude and Longitude) to aggregate multiple predictions
    grouped = candidate_spots.groupby(['Latitude', 'Longitude'], as_index=False)['PredictedOccupancyRatio'].mean()

    # Sort by predicted occupancy ratio (lowest first)
    best_candidates = grouped.sort_values(by='PredictedOccupancyRatio').reset_index(drop=True)

    print("Top recommended parking spots:")
    print(best_candidates[['Latitude', 'Longitude', 'PredictedOccupancyRatio']])
    data_array = best_candidates[['Latitude', 'Longitude', 'PredictedOccupancyRatio']].values.tolist()
    return jsonify(data_array)

@app.route("/api/google", methods = ["GET"])
def get_map():
    zoom = request.args.get("zoom")
    x = request.args.get("x")
    y = request.args.get("y")
    print(x)
    print(y)

    link = f"https://tile.googleapis.com/v1/2dtiles/{zoom}/{x}/{y}?session={SESSION_KEY}&key={GOOGLE_KEY}&orientation=0"

    response = requests.get(link)

    if response.status_code == 200:
        buffer = BytesIO(response.content)
        buffer.seek(0)
        return send_file(buffer, mimetype ="image/png")
    else:
        return jsonify({"error": "Could not fetch tile image"}), 500
    
@app.route("/api/accuracy", methods = ["GET"])
def get_accuracy():

    found = Review.query.filter_by(foundParking = True).count()
    total = Review.query.count()


    accuracy = found/total * 100

    return jsonify({"accuracy": accuracy})


if __name__ == "__main__":
    app.run(debug=True)