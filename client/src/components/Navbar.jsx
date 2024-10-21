// Styles
import "./../styles/navbar.css";
// Images
import Logo from "../assets/images/Logo.png";
// SVG
import Cart from "../assets/svg/Car.svg";
import Menu from "../assets/svg/menu.svg";
// Requerimentos
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
// Componentes
import DropMenu from "./Menu";

const Navbar = () => {
    // Menu Config
  const settings = [
    { text: "Perfil", url: "/ItemPage" },
    { text: "Ingresar", url: "/Login"},
    { text: "Idioma", url: "/Idioma" },
    { text: "Tema", url: "/Tema" },
  ];
  const location = useLocation();
  const [navbarColor, setNavbarColor] = useState(false);

  const changeBackground = () => {
    if (window.scrollY > 200) { 
      setNavbarColor(true);
    } else {
      setNavbarColor(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', changeBackground);
    return () => {
      window.removeEventListener('scroll', changeBackground);
    };
  }, []);
  return (
    <nav className={navbarColor ? 'colored' : 'nav'}>
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
        <a href="#contacts">Contacts</a>
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
