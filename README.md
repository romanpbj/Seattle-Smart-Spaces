Seattle Smart Spaces

  Seattle Smart Spaces is a full-stack web application that uses machine learning to predict parking availability in Seattle. 
  It provides real-time suggestions for low-occupancy parking spots using historical data, spatial
  proximity, and time context (hour, month, season).

How It Works:
  1. Users enter an address or use their GPS location. App fetches current time, month, and determines weekend status.
  
  2. Using scikit-learn's NearestNeighbors, 1200 closest points are selected based on latitude & longitude.
    These become candidate parking spots.
  
  3. The model replaces features (Hour, Month, Season) with user-provided values.
    Extracted features are passed into a trained Random Forest model.
    Predictions (occupancy ratios) are calculated for each spot.
  
  4. Parking spots are grouped by location and averaged then
     sorted by lowest predicted occupancy.
    Results rendered with Google tile images + navigation links.
  
Gathering the Data:

  1. 500 thousand rows of Seattle parking data are read from a CSV
  
  2. Removes outliers and unnecessary data like RestrictedParkingZones
  
  3. Parses coordinates from WKT strings
  
  4. New columns like Hour, Month, weekend HotOs, and OccupancyRatio are created
  
  5. Outputs a cleaned_merged_parking_data.csv file

Model Training (parkingMode.py):

  1. Uses Random Forest Regressor inside a scikit-learn pipeline.
  
  2. Preprocesses categorical data with OneHotEncoder.
  
  3. Trains on features like: HotOs, Hour, Month, Season, Longitude, Latitude
  
  4. Saves trained model to parking_model.pkl using joblib.

Feedback & Accuracy Tracking:

  1. Users can submit whether they found parking at the suggested spot.

  2. Feedback stored in SQLite via SQLAlchemy.
  
  3. /api/accuracy calculates percent of correct predictions.

  4. Model retrained with user feedback. 

