import "./App.css";
import { Navbar } from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return(
    <Router>
      <Navbar />
      <Routes>
      </Routes>
    </Router>
  )
}

export default App;
