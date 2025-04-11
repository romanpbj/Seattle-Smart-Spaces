import axios from "axios"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "../CSS/Feedback.css"

function Feedback(){

    const location = useLocation()
    const {lat, lon} = location.state
    const [review, setReview] = useState("")
    const [message, setMessage] = useState("")

    function handleYes(){

        axios.post("http://127.0.0.1:5000/api/feedback", null, { params : {lat: lat, lon: lon, foundParking: 1}})
        .then(response => {
            setReview("Thank you for your response!")
        })
        .catch(err => {
            setMessage("Error submitting positive feedback")
        })
    }

    function handleNo(){
        axios.post("http://127.0.0.1:5000/api/feedback", null, { params : {lat: lat, lon: lon, foundParking: 0}})
        .then(repsonse => {
            setReview("Thank you for your response, we will improve our predictions based on your feedback.")

        })
        .catch(err => {
            setMessage("Error submitting negative feedback")
        })
    }

    return(
        <div className="feedback-container">
            <h3 >Did you find parking at this location?</h3>
            <div className="btn-container">
                {review ? <></> : <button className="yes-btn" onClick={handleYes}>Yes</button> }
                {review ? <></> : <button className="no-btn" onClick={handleNo}>No</button> }
                {review ? <p>{review}</p> : <></>}
                {message ? <p>{message}</p> : <></>}
            </div>
        </div>
    )
}

export default Feedback