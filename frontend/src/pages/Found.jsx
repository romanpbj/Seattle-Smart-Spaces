import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../CSS/FoundParking.css'

function Found() {
  const location = useLocation();
  const {parking, userLat, userLong} = location.state;
  const [images, setImages] = useState([]);
  const didFetchRef = useRef(false);
  let tileSet = new Set()
  const [predictions, setPredictions] = useState([])
  const [route, setRoute] = useState([])
  const [stateLat, setStateLat] = useState([])
  const [stateLong, setStateLong] = useState([])
  const navigate = useNavigate()

  function latLonToTile(lat, lon, zoom) {
    const tileCount = Math.pow(2, zoom);
    const xTile = Math.floor((lon + 180) / 360 * tileCount);
    const latRad = lat * Math.PI / 180;
    const yTile = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * tileCount);
    
    let key = `${xTile}, ${yTile}`

    if (!tileSet.has(key)){
        tileSet.add(key)

        return { x: xTile, y: yTile}
    }
    else{
        return null;
    }
  }

  useEffect(() => {
    if (!didFetchRef.current && parking && parking.length > 0) {
        parking.forEach((item) => {
        const lat = item[0];
        const lon = item[1];
        const poc = item[2]
        const googleData = latLonToTile(lat, lon, 17);

        if (googleData !== null){
                axios.get("http://127.0.0.1:5000/api/google", {params: { x: googleData.x, y: googleData.y, zoom: 17 }, responseType: "blob"})
                .then((response) => {
                const imageUrl = URL.createObjectURL(response.data);
                setImages((prevImages) => [...prevImages, imageUrl]);
                setPredictions((prevPredictions) => [...prevPredictions, poc])
                setRoute((road) => [...road, `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLong}&destination=${lat},${lon}&travelmode=driving`])
                setStateLat((prevLat) => [...prevLat, lat])
                setStateLong((prevLong) => [...prevLong, lon])

                })
                .catch((error) => {
                console.error("Error fetching tile:", error);
                });
        }
        didFetchRef.current = true;
        }
    )}
  }, [parking]);

  return (
    <div className="found-parking-container">
      <h2>Found Parking</h2>
      <div className="parking-grid">
        {images.map((img, index) => (
          <div key={index} className="parking-item">
            <img src={img} alt={`Tile ${index}`} />
            <p>Predicted to be {Math.round(predictions[index] * 100)}% Occupied</p>
            <button onClick={() => (window.open(route[index], "_blank", navigate("/feedback", { state: {lat: stateLat[index], lon: stateLong[index]} })))}>
            📍Get Directions
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Found;