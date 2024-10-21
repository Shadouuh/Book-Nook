import pfp from "./../assets/svg/ig.svg";
import GenreCard from "../components/genreCard";
import "./../styles/profile.css";
import Save from './../assets/svg/Save.svg';
import BookCard from "../components/BookCard";
const Profile = () => {
  return (
    <div className="userPage">
      <div className="sideProfile">
        <div className="user">
          <img src={pfp} alt="" />
          <div className="row">
            <h3>Antelo Santino</h3>
            <h5>@Shadouuh</h5>
          </div>
        </div>
        <div className="desc">
          <p>
            Un amante de los libros es una persona curiosa y apasionada, siempre
            en busca de nuevas historias y conocimientos. Con un libro en mano,
            puede explorar mundos inimaginables y descubrir nuevas perspectivas.
          </p>
        </div>
        <hr />
        <h1>Géneros</h1>
        <div className="genreContainer">
          <GenreCard
            content="Ficción"
            colors={["#4F3130", "#FF6B6B"]}
            textColor={"#FFFFFF"}
          />
          <GenreCard
            content="Política"
            colors={["#264027", "#1D4D2B"]}
            textColor={"#FFFFFF"}
          />
          <GenreCard
            content="Edgar Allan Poe"
            colors={["#0A1045", "#1B1F4B"]}
            textColor={"#FFFFFF"}
          />
          <GenreCard
            content="Terror Espacial"
            colors={["#0A1045", "#4B1A0A"]}
            textColor={"#FFFFFF"}
          />
          <GenreCard
            content="Documental Realista"
            colors={["#0A1045", "#1A2B0A"]}
            textColor={"#FFFFFF"}
          />
          <GenreCard
            content='"1842"'
            colors={["#F90093", "#FF9A00"]}
            textColor={"#FFFFFF"}
          />
        </div>
      </div>
      <div className="main">
        <div className="favs">
        
          <h1><img src={Save} alt="" className="saveImg"/> Favoritos</h1>
          <div className="containerFavs">
          <BookCard />
          <BookCard />
          <BookCard />
          <BookCard />
          </div>
        </div>
        <div className="novedades">
          <h4>Aca irian novedades (CENTRADO OBVIO)</h4>
        </div>
      </div>
    </div>
  );
};

export default Profile;
