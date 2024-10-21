// SVG
import ig from "../assets/svg/ig.svg";
import x from "../assets/svg/X.svg";
import wp from "../assets/svg/wp.svg";
// Images
import Logo from "../assets/images/Logo.png";
// Requerimentos
import { NavLink } from "react-router-dom";
// Styles
import "./../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footerContainer">
      <div className="footerContent">
        <div className="footerSection">
          <h2 className="footTitle">BookNook</h2>
          <img src={Logo} alt="Logo BookNook" className="footerLogo" />
        </div>

        <div className="footerSection">
          <h2>Navegación</h2>
          <NavLink to="/" className={"navLink"}>
            Home
          </NavLink>
          <NavLink to="/About" className={"navLink"}>
            About Us
          </NavLink>
          <NavLink to="/Books" className={"navLink"}>
            Books
          </NavLink>
          <NavLink to="/Perfil" className={"navLink"}>
            My Profile
          </NavLink>
        </div>

        <div className="footerSection">
          <h2>Contacto</h2>
          <p>
            <a href="mailto:book.nook@outlook.com.ar">
              Email: book.nook@outlook.com.ar
            </a>
          </p>
          <p>Teléfono: +54 9 11 2366-3800</p>
          <div className="socialMedia">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={ig} alt="Instagram" className="socialIcon" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <img src={x} alt="X" className="socialIcon" />
            </a>
            <a
              href="https://wa.me/5491123663800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={wp} alt="WhatsApp" className="socialIcon" />
            </a>
          </div>
        </div>

        <div className="footerSection">
          <h2>Sede en Lomas</h2>
          <p>Dirección: Oliver 425, Lomas de Zamora</p>
          <p>Teléfono: +54 9 11 5423-8920</p>
          <h2>Sede en Banfield</h2>
          <p>Dirección: Vergara 2280, Banfield</p>
        </div>
      </div>

      <div className="footerBottom" id="contacts">
        <hr />
        <p>&copy; 2024 BookNook. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
