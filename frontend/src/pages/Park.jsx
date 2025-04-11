import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/LocationOptions.css";

function Park() {
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  
  const navigate = useNavigate();

  function handleAddress() {
    const fullAddress = `${street}, Seattle, WA ${zip}, USA`;

    axios.get("http://127.0.0.1:5000/api/getCoords", {params: { address: fullAddress }})
      .then((response) => {
        submit(response.data.lat, response.data.long);
      })
      .catch((error) => {
        console.error("Error fetching coordinates from address:", error);
      });
  }

  function handleGetLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLong = position.coords.longitude;
          submit(userLat, userLong);
        },
        (error) => {
          console.error("Error getting GPS coordinates:", error);
        }
      );
    }
  }

  function submit(userLat, userLong) {
    const now = new Date();
    const data = {
      lat: userLat,
      long: userLong,
      month: now.getMonth() + 1,
      hour: now.getHours(),
      isWeekend: now.getDay() === 0 || now.getDay() === 6 ? 1 : 0,
    };
    usedLocation(data);
  }

  function usedLocation(data) {
    axios
      .post("http://127.0.0.1:5000/api/findParking", data)
      .then((response) => {
        navigate("/foundparking", { state: {parking: response.data, userLat: data.lat, userLong: data.long} });
      })
      .catch((error) => {
        console.error("Error posting parking data:", error);
      });
  }

  return (
    <div className="options-container">
      <div className="option-box">
        <h1>Street Address</h1>
        <p>
          By providing a valid Seattle street address and its associated zip code,
          the nearest predicted available parking will be found.
        </p>
        <br />
        <input
          className="input-one"
          type="text"
          placeholder="Street"
          onChange={(e) => setStreet(e.target.value)}
        />
        <br />
        <input
          className="input-two"
          type="text"
          placeholder="Zip Code"
          onChange={(e) => setZip(e.target.value)}
        />
        <p className="address-line">{`${street}, Seattle, WA ${zip}, USA`}</p>
        <button onClick={handleAddress}>Submit Address</button>
      </div>
      <div className="option-box">
        <h1>GPS Location</h1>
        <p>
          If you are currently in Seattle, you may provide access to your location,
          and the nearest predicted available parking will be found.
        </p>
        <button className="location-btn" onClick={handleGetLocation}>
          Use My Location
        </button>
      </div>
      <div className="option-box full-width">
        <p>
          For best accuracy, use Seattle Smart Spaces between 8am - 8pm. Seattle
          Transportation does not record parking data outside of these hours since
          parking is free during this time. Using this parking service outside of
          Seattle Transportation parking meter times may provide inaccurate
          prediction rates as data on these times do not exist.
        </p>
      </div>
    </div>
  );
}

export default Park;