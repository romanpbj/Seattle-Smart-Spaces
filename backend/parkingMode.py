import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import joblib

data = pd.read_csv("cleaned_merged_parking_data.csv")

X = data[["ParkingTimeLimitCategory", "ParkingCategory", "HotOs","Hour","Season","Month","Longitude","Latitude"]]
y = data["OccupancyRatio"]

preprocessor = ColumnTransformer(transformers=[
    ("cat_enc", OneHotEncoder(handle_unknown='ignore'), ["ParkingTimeLimitCategory","ParkingCategory"])
], remainder='passthrough')

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(random_state=42))
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=13)

pipeline.fit(X_train, y_train)

prediction = pipeline.predict(X_test)

joblib.dump(pipeline, "parking_model.pkl")

mse = mean_squared_error(y_test, prediction)
print("Mean Squared Error:", mse)