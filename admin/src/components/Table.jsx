/* eslint-disable react/prop-types */
import axios from "axios";
import { useState, useEffect } from "react";

const Table = ({ tableName }) => {
  const [table, setTable] = useState([]);
  // Almacena en table, la consulta correspondiente al montar el Componente.
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
  // .map(Tabla => th || td)
  return (
    <>
      <h1>{tableName}</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            {table.length > 0 &&
              Object.keys(table[0]).map((col) => (
                <th key={col} style={styles.th}>
                  {col}
                </th>
              ))}
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, idx) => (
                <td key={idx} style={styles.td}>
                  {value}
                </td>
              ))}
              <td style={styles.td}>
                <button style={styles.editButton}>Editar</button>
                <button style={styles.deleteButton}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const styles = {
  table: {
    width: "80%",
    margin: "20px auto",
    borderCollapse: "collapse",
    fontFamily: "",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  th: {
    backgroundColor: "#02020af4",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "700",
    textAlign: "center",
    color: "#FFFBFA",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#02111B",
    backgroundColor: "#FFFBFA",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
  },
  editButton: {
    padding: "6px 12px",
    fontSize: "14px",
    backgroundColor: "#4CAF50",
    margin: "10px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: "#45a049",
    },
  },
  deleteButton: {
    padding: "6px 12px",
    margin: "10px",
    fontSize: "14px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: "#d32f2f",
    },
  },
};

export default Table;
