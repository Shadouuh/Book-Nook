/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import "./../styles/menu.css";
const DropMenu = ({ content, options, classNom, classDrop }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Funcion de apertura
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="dropdown">
      <button onClick={toggle} className={classNom}>
        {content}
      </button>
      {isOpen && (
        <ul className={classDrop}>
          {options.map((option) => (
            <li key={option.text}>
              <Link to={option.url}>{option.text}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default DropMenu;
