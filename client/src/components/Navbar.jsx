// Styles
import "./../styles/navbar.css";
// Images
import Logo from "../assets/images/Logo.png";
// SVG
import Cart from "../assets/svg/Car.svg";
import Menu from "../assets/svg/menu.svg";
// Requerimentos
import { NavLink, useLocation } from "react-router-dom";
// Componentes
import DropMenu from "./Menu";

const Navbar = () => {
    // Menu Config
  const settings = [
    { text: "Perfil", url: "/Login" },
    { text: "Idioma", url: "/Idioma" },
    { text: "Tema", url: "/Tema" },
  ];
  const location = useLocation();
  return (
    <nav>
      <div className="navTitle">
        <img src={Logo} alt="Book Nook" className="navImg" />
        <h1>
          Book<div className="colorH1">Nook</div>
        </h1>
      </div>
      <ul>
        <NavLink to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </NavLink>
        <NavLink
          to="/Catalogo"
          className={location.pathname === "/Catalogo" ? "active" : ""}
        >
          Books
        </NavLink>
        <NavLink
          to="/About"
          className={location.pathname === "/About" ? "active" : ""}
        >
          About Us
        </NavLink>
        <NavLink
          to="/Home"
          className={location.pathname === "/Home" ? "active" : ""}
        >
          Contacts
        </NavLink>
      </ul>
      <div className="configs">
        <a href="">
          <img src={Cart} alt="Cart" className="menuImg" />
        </a>
        <DropMenu
          options={settings}
          classDrop="dropdownMenu"
          classNom="dropdownButton"
          content={<img src={Menu} className="menuImg" />}
        />
      </div>
    </nav>
  );
};
export default Navbar;
