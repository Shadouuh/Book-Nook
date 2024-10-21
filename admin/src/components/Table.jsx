/* eslint-disable react/prop-types */
import axios from "axios";
import { useState, useEffect } from "react";
import './../styles/Table.css';

const Table = ({ tableName }) => {
  const [table, setTable] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/${tableName}`)
      .then((response) => {
        console.log("Datos recibidos:", response.data.resultados);
        setTable(response.data.resultados);
      })
      .catch((error) => {
        console.error("Error en Fetch ", error);
      });
  }, [tableName]);

  if (table.length > 0) {
    console.log(table);
    Object.keys(table[0]).map((att) => console.log(att));
  }

  return (
    <div className="tableContainer">
      <h1>{tableName}</h1>
      <table className="table">
        
        <thead>
          <tr>
            {table.length > 0 &&
              Object.keys(table[0]).map((col) => (
                <th key={col} className="th">
                  {col}
                </th>
              ))}
            <th className="th">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, idx) => (
                <td key={idx} className="td">
                  {value}
                </td>
              ))}
              <td className="td">
                <button className="editButton"><span>Editar</span></button>
                <button className="deleteButton"><span>Eliminar</span></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
