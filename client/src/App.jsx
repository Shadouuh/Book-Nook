// Requerimentos
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Pages
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Perfil from "./pages/Perfil";
import Books from "./pages/Books";
import Login from "./pages/Login";
// Styles
import "./index.css";
// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
const App = () => {
  return (
    <Router>
      <header>
        <Navbar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<AboutUs />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/Catalogo" element={<Books/>} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </Router>
  );
};

export default App;
