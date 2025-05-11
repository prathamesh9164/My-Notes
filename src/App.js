import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import NoteState from "./context/NoteState";
import  Alert  from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState } from "react";
import FileConverterPage from './pages/FileConverterPage';



// import FileConverter from './components/FileConverter';
// import FileConverter from "./components/FileConverter";




function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    <NoteState>
      <Router>
        <Navbar />
        <Alert alert={alert}/>
        <div className="container">
        <Routes>
          <Route path="/" element={<Home showAlert={showAlert} />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login showAlert={showAlert}/>} />
          <Route path="/signup" element={<Signup showAlert={showAlert}/>} />
          <Route exact path="/fileconverter" element={<FileConverterPage />} />
          {/* <Route path="/convert" element={<FileConverter />} /> */}


        </Routes>
        </div>
      </Router>
    </NoteState>
  );
}

export default App;
