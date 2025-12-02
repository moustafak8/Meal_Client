import "./App.css";
import { Navbar } from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Sign_up } from "./pages/Sign-up";
import { Login } from "./pages/Login";
import { LoginProvider } from "./Context/loginContext";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { Pantry } from "./pages/Pantry";

function App() {
  return (
    <LoginProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/sign-up" Component={Sign_up} />
          <Route path="/login" Component={Login} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pantry"
            element={
              <ProtectedRoute>
                <Pantry />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </LoginProvider>
  );
};

export default App;
