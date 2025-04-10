import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import "../Home.css"

function Home(){

    const navigate = useNavigate()


    return (
        <div className="intro-container">
          <p className="intro-text">
            Welcome to Seattle Smart Spaces—your ultimate parking assistant for
            Seattle! Our website harnesses the power of machine learning, trained on
            hundreds of thousands of parking records, to accurately predict
            occupancy rates at paid parking lots across the city. Whether you’re on
            the go or planning ahead, simply share your current location or a
            destination address, and we'll instantly identify the nearest parking
            lots with the lowest occupancy—helping you save time, stress, and money.
            Get ready to experience smarter, faster parking in Seattle with precise
            directions right to your ideal spot.
          </p>
          <button
            className="intro-button"
            onClick={() => navigate("/park")}
          >
            Find Parking
          </button>
        </div>
      );
    }

export default Home