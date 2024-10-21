import "./../styles/catalog.css";
import DropMenu from '../components/Menu';
const Books = () => {
    const filters = [
        {text: "Perfil", url: "/Perfil"},
        {text: "Perfil", url: "/Perfil"},
    ];
    const tableConfig = [
      {text: "Perfil", url: "/Perfil"},
        {text: "Perfil", url: "/Perfil"},
    ]
  return (
    <div className="bookBody">
      <section className="sidebar">
        <h1>SeccionSide</h1>
        <h1>SeccionSide</h1>
        <h1>SeccionSide</h1>
        <DropMenu
            options={tableConfig}
            classDrop="dropdownMenu"
            classNom="btnTable"
            content="Tablas"
          />
        <h1>SeccionSide</h1>
      </section>
      <section className="bookMainContainer">
        <nav className="searchBookNav">
          <h2>Buscador de Productos</h2>
          <DropMenu
          options={filters}
          classDrop="dropdownMenu"
          classNom="dropdownButton"
          content={<h2>Filtros</h2>}
        />
        </nav>
        <section className="bookMain">
          <h1>Hola catalogo</h1>
        </section>
      </section>
    </div>
  );
};
export default Books;
