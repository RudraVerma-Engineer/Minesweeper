import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home.jsx";
// import Game from "./pages/Game.jsx";
// import History from "./pages/History.jsx";
// import Login from "./Component/Login.jsx";
// import Signup from "./Component/Signup.jsx";
// import ProtectedRoute from "./Component/ProtectedRoute.jsx";
import Signup from "./Component/signup.jsx";
import ProtectedRoute from "./Component/ProctectedRoutes.jsx";
import Home from "./pages/Home.jsx";
import Login from "./Component/Login.jsx";
import CreateGrid from "./Component/createGrid.jsx";
import History from "./pages/History.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <CreateGrid />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
