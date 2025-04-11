Seattle Smart Spaces

Seattle Smart Spaces is a full-stack web application that uses machine learning to predict parking availability in Seattle. It provides real-time suggestions for low-occupancy parking spots using historical data, spatial proximity, and temporal context (hour, month, season).

Features:

Predicts real-time parking occupancy based on user location and time.

Integrates Google Maps Tile API for live map visuals.

Feedback system to track user-reported accuracy.

Data cleaning and preprocessing pipeline in Python.

Machine learning pipeline using Random Forest Regressor.

Tech Stack:

Frontend: React, JavaScript, Axios, CSS

Backend: Flask, SQLAlchemy, SQLite

ML & Data: pandas, NumPy, scikit-learn, joblib

APIs: Google Maps Geocoding + Tile API

How It Works:

1. User Input

Users enter an address or use their GPS location.

App fetches current time, month, and determines weekend status.

2. Nearest Neighbor Search

Using scikit-learn's NearestNeighbors, 1200 closest points are selected based on latitude & longitude.

These become candidate parking spots.

3. Context-Aware Prediction

The model replaces temporal features (Hour, Month, Season) with user-provided values.

Extracted features are passed into a trained Random Forest model.

Predictions (occupancy ratios) are calculated for each spot.

4. Results

Spots are grouped by location and averaged if duplicates exist.

Sorted by lowest predicted occupancy.

Results rendered with Google tile images + navigation links.

Data Cleaning (dataCleaning.py):

Reads raw CSVs of Seattle parking meter data.

Labels rows with weekend/weekday using custom file list.

Parses coordinates from WKT strings.

Extracts datetime features and adds custom features (e.g., Season).

Filters and normalizes data (e.g., occupancy ratios).

Output: cleaned_merged_parking_data.csv

Model Training (parkingMode.py):

Uses Random Forest Regressor inside a scikit-learn pipeline.

Preprocesses categorical data with OneHotEncoder.

Trains on features like:

ParkingTimeLimitCategory

ParkingCategory

HotOs, Hour, Month, Season

Longitude, Latitude

Evaluates model using Mean Squared Error.

Saves trained model to parking_model.pkl using joblib.

Feedback & Accuracy Tracking:

Users can submit whether they found parking at the suggested spot.

Feedback stored in SQLite via SQLAlchemy.

/api/accuracy calculates percent of correct predictions.

📸 Screenshots (Optional)

Add screenshots of homepage, prediction results, feedback form, and data page here.

Future Improvements:

Add user authentication for saving preferences.

Model retraining with user feedback.
