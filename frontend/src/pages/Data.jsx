import "../CSS/Data.css"
import axios from "axios";
import { useState, useEffect } from "react";

function Data(){

    const [accuracyS, setAccuracyS] = useState("")

    function handleAccuracy(){
        axios.get("http://127.0.0.1:5000/api/accuracy")
        .then(response => {
            setAccuracyS(response.data.accuracy)
        })
        .catch(err => {
            console.log("error fetching accuracy", err)
        })
    }

    return(
        <div className="data-container">

        <div>
            <img className="sample-image" src="/Data Sample.png" alt="Data Sample" />
        </div>
        <div>
            <p>
            <p>
              Sample row from the dataset used to generate predictions.
            </p>
            </p>
        </div>
        <div className="text-container">
            <p>
            Using stratified sampling, hundreds of thousands of records from Seattle's Paid Parking Meter dataset were selected and used to train the machine learning model.
            The model was built using a Random Forest Regressor, leveraging both raw and engineered features. Original columns such as Occupancy DateTime, Paid Occupancy, 
            and Parking Space Count were combined with enriched data including precise geolocation, seasonal categorization, and calculated occupancy ratios. This cleaned 
            and structured dataset enabled the model to predict parking occupancy with a mean squared error of approximately 0.88.
            </p>
          </div>

          <div className="graphs">
            <img src="/Hour Graph.png" alt="Hour Graph" className="graph-image"/>
            <img src="/Month Graph.png" alt="Month Graph" className="graph-image"/>
          </div>

          <div className="text-containerg">
            <p>
            The graphs above illustrate how parking occupancy in Seattle varies by both hour of the day and month of the year, 
            based on predictions from the trained machine learning model. As seen in the first graph, occupancy tends to rise 
            steadily throughout the late morning and early afternoon, peaking around midday and again in the early evening. 
            The second graph shows that certain months—particularly spring and summer—experience higher average occupancy, likely due to increased travel, events, and tourism.
            </p>
            <p>
            These temporal patterns play a critical role in predicting parking availability. When a user accesses the Seattle Smart Spaces service, 
            their current date and time—along with their exact geolocation—are automatically captured. This contextual information is then fed into 
            the trained Random Forest Regressor, which uses it alongside historical trends to return the best nearby parking locations based on predicted 
            occupancy. By factoring in the time of day and seasonal fluctuations, the model is able to generate highly accurate, real-time recommendations 
            that reflect real-world parking behavior.
            </p>
          </div>
        <div>
            <p>Data is contantly updated with user feedback.</p>
            <button onClick={handleAccuracy}>Calculate Parking Accuracy</button>
            {accuracyS? <p>{Math.round(accuracyS)}%</p> : <></>}
        </div>
        </div>
      );
    }

export default Data