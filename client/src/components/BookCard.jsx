import "./../styles/bookCard.css";
import Logo from "./../assets/images/Logo.png";
import { useState } from "react";

const BookCard = () => {
  const [expandedCard, setExpandedCard] = useState(false);

  const toggleExpand = () => {
    setExpandedCard(!expandedCard);
  };
  return (
    <div className="bookContainer">
      <div className="bookCard" onClick={toggleExpand}>
        <img src={Logo} alt="Book" className="bookImg" />
        <h3>Joker</h3>
        <h4>By: Anthony</h4>
        <p>⭐⭐⭐</p>
        <h3>$ 4.500,00 ARS</h3>
      </div>
      <div className={expandedCard ? "bookInfo" : "bookInfoTransparent"} onClick={toggleExpand}>
        <h1 onClick={toggleExpand}>Hola Centrado</h1>
      </div>
    </div>
  );
};
export default BookCard;
