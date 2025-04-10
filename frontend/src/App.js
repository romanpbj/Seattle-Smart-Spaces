import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Park from "./pages/Park";
import Found from "./pages/Found";
import NavBar from "./components/NavBar";
import Feedback from "./pages/Feedback";
import Data from "./pages/Data";

function App() {
  return (
    <Router>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/park" element={<Park />} />
          <Route path="/feedback" element = {<Feedback />} />
          <Route path="/data" element = {<Data />} />
          <Route path="/foundparking" element={<Found />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;