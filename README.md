Seattle Smart Spaces

  Seattle Smart Spaces is a full-stack web application that uses machine learning to predict parking availability in Seattle. It provides real-time suggestions for low-occupancy parking spots using historical data, spatial   proximity, and temporal context (hour, month, season).

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
  
Data:

  Thousands of rows of Seattle parking data are read from a CSV
  
  Removes outliers and unnecessary data like RestrictedParkingZones
  
  Parses coordinates from WKT strings
  
  New columns like Hour, Month, weekend HotOs, and OccupancyRatio are created
  
  Outputs a cleaned_merged_parking_data.csv file

Model Training (parkingMode.py):

  Uses Random Forest Regressor inside a scikit-learn pipeline.
  
  Preprocesses categorical data with OneHotEncoder.
  
  Trains on features like: HotOs, Hour, Month, Season, Longitude, Latitude
  
  Saves trained model to parking_model.pkl using joblib.

Feedback & Accuracy Tracking:

  Users can submit whether they found parking at the suggested spot.

  Feedback stored in SQLite via SQLAlchemy.
  
  /api/accuracy calculates percent of correct predictions.


Future Improvements:

  Add user authentication for saving preferences.
  
  Model retraining with user feedback.
