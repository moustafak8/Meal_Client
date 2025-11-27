import type { Component } from "react";
import "./App.css";
import { Navbar } from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from "./pages/Home";
function App() {
  return(
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" Component={Home} />
      </Routes>
    </Router>
  )
}

export default App;
