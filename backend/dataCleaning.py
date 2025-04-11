import pandas as pd
import glob
import numpy as np

csv_files = [file for file in glob.glob("*.csv") if "merged" not in file and "cleaned" not in file]

weekend_files = ["A1PM WKN.csv", "A2PM WKN.csv", "F W4PM WKN.csv", "F W5PM WKN.csv", 
                 "JU 9AM WKN.csv", "JU 10AM WKN.csv", "N 5PM WKN.csv", "N 6PM WKN.csv", 
                 "N 7PM WKN.csv", "N 8PM WKN.csv", "M 9 AM W", "M 10 AM W", "JU 1 PM W",
                 "JU 2 PM W", "S 5 PM W", "S 6PM W", "S 7 PM W", "S 8 PM W", "F 11 AM W", "F 12 AM W"]

dfs = []
for file in csv_files:
    df = pd.read_csv(file, low_memory=False)
    df['HotOs'] = 1 if file in weekend_files else 0
    dfs.append(df)

merged_df = pd.concat(dfs, ignore_index=True)

merged_df['PaidOccupancy'] = pd.to_numeric(merged_df['PaidOccupancy'], errors='coerce')
merged_df['PaidOccupancy'] = merged_df['PaidOccupancy'] + 1.2

merged_df = merged_df[merged_df['ParkingCategory'] != "Restricted Parking Zone"]

merged_df['OccupancyDateTime'] = pd.to_datetime(
    merged_df['OccupancyDateTime'], format="%m/%d/%Y %I:%M:%S %p", errors='coerce'
)

merged_df['Hour'] = merged_df['OccupancyDateTime'].dt.hour
merged_df['Month'] = merged_df['OccupancyDateTime'].dt.month

conditions = [
    merged_df['Month'].isin([1, 2, 12]),
    merged_df['Month'].isin([3, 4, 5]),
    merged_df['Month'].isin([6, 7, 8]),
    merged_df['Month'].isin([9, 10, 11])
]
choices = [1, 2, 3, 4]
merged_df['Season'] = np.select(conditions, choices, default=0)

def extract_coords(point_str):
    if pd.isna(point_str):
        return pd.Series([None, None])
    try:
        coords = point_str.replace("POINT (", "").replace(")", "").split()
        longitude = float(coords[0])
        latitude = float(coords[1])
        return pd.Series([longitude, latitude])
    except Exception as e:
        return pd.Series([None, None])

merged_df[['Longitude', 'Latitude']] = merged_df['Location'].apply(extract_coords)

cols_to_drop = ["PaidParkingRate", "BlockfaceName", "SideOfStreet", "SourceElementKey"]
merged_df.drop(columns=cols_to_drop, inplace=True)

merged_df['OccupancyRatio'] = merged_df['PaidOccupancy'] / merged_df['ParkingSpaceCount']
merged_df['OccupancyRatio'] = merged_df['OccupancyRatio'].fillna(0)

merged_df.to_csv("cleaned_merged_parking_data.csv", index=False)

print(merged_df.head())