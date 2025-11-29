import "./App.css";
import { Navbar } from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Sign_up } from "./pages/Sign-up";
import { Login } from "./pages/Login";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/sign-up" Component={Sign_up} />
        <Route path="/login" Component={Login} />
      </Routes>
    </Router>
  );
}

export default App;
