import BG from "./../assets/images/background1.jpg";
import "./../styles/home.css";
import BookCard from "../components/BookCard";
const Home = () => {
  return (
    <>
    <div className="contImg">
      <img src={BG} alt="" />
      <div className="content">
        <h1>BookNook</h1>
        <h2>
          Un amante de los libros es una persona curiosa y apasionada, siempre
          en busca de nuevas historias y conocimientos. Con un libro en mano,
          puede explorar mundos inimaginables y descubrir nuevas perspectivas.
        </h2>
        <button className="btnContent">Inicia tu Aventura!</button>
      </div>
    </div>
    
    <div className="sectionCards" id="firstSec">
    <hr />
    <h1>Ficcion</h1>
    <div className="containerCard">
    <BookCard />
    <BookCard />
    <BookCard />
    <BookCard />
    <BookCard />
    <BookCard />
    <BookCard />
    <BookCard />
    <BookCard />
    <BookCard />
    <BookCard />
    <BookCard />
    </div>
    <button className="btnContent">Ver todos los Productos</button>
    </div>
    <hr />
    <div className="sectionCategory">
    <div className="categoria" id="cat1">
    <div className="color">
        <h1>Ciencia Ficcion</h1>
      </div>
      </div>
      <div className="categoria" id="cat2">
      <div className="color">
        <h1>Amor Cosmico</h1>
      </div>
      </div>
      <div className="categoria" id="cat3">
      <div className="color">
        <h1>Novedades</h1>
      </div>
      </div>
    </div>
    <div className="sectionCards">
    <hr />
    <h1>Edgar Allan Poe</h1>
    <div className="containerCard">
    <BookCard />
    <BookCard />
    <BookCard />
    <BookCard />
    </div>
    <button className="btnContent">Ver todos los Productos</button>
    </div>
    <div className="sectionCards">
    <hr />
    <h1>Ciencia Ficcion</h1>
    <div className="containerCard">
    <BookCard />
    <BookCard />
    <BookCard />
    <BookCard />
    </div>
    <button className="btnContent">Ver todos los Productos</button>
    </div>
    
    </>
  );
};
export default Home;
