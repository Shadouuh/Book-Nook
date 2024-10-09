import "./index.css";
import bell from "./assets/svg/bell.svg";
import DropMenu from "./components/Menu";
import Menu from "./assets/svg/config.svg";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesConfig from "../../server/routes/tableRoutes.jsx";

const App = () => {
  const settings = [
    { text: "Perfil", url: "/Profile/${id}" },
    { text: "Idioma", url: "/Idioma" },
    { text: "Tema", url: "/Tema" },
  ];
  // Tablas
  const tableConfig = [
    { text: "Autores", url: "/autores" },
    { text: "Carrito", url: "/carrito" },
    { text: "Carrito Items", url: "/carrito_items" },
    { text: "Categorías", url: "/categorias" },
    { text: "Clave Libro", url: "/clave_libro" },
    { text: "Editoriales", url: "/editoriales" },
    { text: "Libros", url: "/libros" },
    { text: "Libros Imágenes", url: "/libros_imgs" },
    { text: "Libro Categoría", url: "/libro_categoria" },
    { text: "Login", url: "/login" },
    { text: "Pedidos", url: "/pedidos" },
    { text: "Usuarios", url: "/usuarios" },
    { text: "Usuario Autor Favorito", url: "/usuario_autor_favorito" },
    { text: "Usuario Categoría Favorita", url: "/usuario_categoria_favorita" },
    { text: "Usuario Libro", url: "/usuario_libro" },
  ];

  return (
    <Router>
      <div className="adminBody">
        <section className="sidebar">
          <div className="user">
            <h1>Antelo Santino</h1>
            <h4>Super Admin</h4>
            <button>Dashboard</button>
          </div>
          <hr />

          <button>Personal</button>
          <button>Ventas</button>
          <DropMenu
            options={tableConfig}
            classDrop="tableDrop"
            classNom="btnTable"
            content="Tablas"
            link={true}
          />
        </section>

        <section className="adminMain">
          <nav>
            <h2>Administrador</h2>
            <ul>
              <a href="#">
                <img src={bell} alt="Notification" className="campana" />
              </a>
              <DropMenu
                options={settings}
                classDrop="dropdownMenu"
                classNom="dropdownButton"
                content={<img src={Menu} />}
              />
            </ul>
          </nav>
          <main>
            <RoutesConfig />
          </main>
        </section>
      </div>
    </Router>
  );
};

export default App;
