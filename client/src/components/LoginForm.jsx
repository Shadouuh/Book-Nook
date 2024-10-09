// Requerimentos
import { useState } from "react";
// Styles
import "./../styles/login.css";
import axios from "axios";

const LoginForm = () => {
  const [user, setUser] = useState({
    email: "",
    tel: 0,
    clave: "",
    contraClave: ""
  });
  const [formType, setForm] = useState(false);

  const toggle = () => {
    setForm(!formType);
  };
  const setInput = (input) => {
    const { name, value } = input.target;
    setUser({ ...user, [name]: value });
  };
  const register = (e) => {
    e.preventDefault();
    if (user.clave == user.contraClave){
        axios
      .post("http://localhost:3000/register", user)
      .then((response) => {
        console.log(response.data.message);
        alert("Usuario Registrado: " + response.data.message);
      })
      .catch((error) => {
        console.log(error);
        alert("error en algo: " + error);
      });
    } else {
        alert("Las claves deben ser Identicas");
    }
     
  };
  return (
    <>
      <div className="form">
        {formType ? (
          <div className="form">
            <div className="changeForm">
              <h2>Bienvenido a Book Nook</h2>
              <h3>¿Aún no tienes una cuenta?</h3>
              <h4>Estás a punto de descubrir un mundo de fantasía.</h4>
              <button onClick={toggle}>Crea una cuenta</button>
            </div>
            <form className="loginForm">
              <h1>Login</h1>
              <hr />
              <input
                type="text"
                placeholder="Ingrese su Nombre de Usuario, Email u Telefono"
              />
              <input type="password" placeholder="Ingrese su Contraseña" />
              <button>Iniciar Sesion!</button>
              <a href="">Olvido su Contraseña?</a>
            </form>
          </div>
        ) : (
          <div className="form">
            <div className="changeForm">
              <h2>¡Bienvenido de nuevo a Book Nook!</h2>
              <h3>¿Ya tienes una cuenta?</h3>
              <h4>
                Inicia sesión y continúa tu aventura en el mundo de los libros.
              </h4>
              <button onClick={toggle}>Inicia sesión</button>
            </div>
            <form className="loginForm" onSubmit={register}>
              <h1>Registro</h1>
              <hr />
              <h4>Datos Personales</h4>
              <div className="rows">
                <input type="text" placeholder="Ingrese su Nombre" />
                <input type="text" placeholder="Ingrese su Apellido" />
              </div>
              <input type="text" placeholder="Ingrese su Dirección" />
              <input type="date" placeholder="Ingrese su fecha de Nacimiento" />
              <hr />
              <h4>Información de Sesión</h4>
              <input type="text" placeholder="Ingrese su Nombre de Usuario" />
              <div className="rows">
                <input
                  type="password"
                  placeholder="Ingrese su Contraseña"
                  name="clave"
                  required
                  onChange={setInput}
                />
                <input
                  type="password"
                  placeholder="Confirme su Contraseña"
                  name="contraClave"
                  required
                  onChange={setInput}
                />
              </div>
              <div className="rows">
                <input
                  type="email"
                  placeholder="Ingrese su Email"
                  name="email"
                  required
                  onChange={setInput}
                />
                <input
                  type="tel"
                  placeholder="Ingrese su Teléfono"
                  name="tel"
                  required
                  onChange={setInput}
                />
              </div>
              <input type="submit" className="button" value="Cree su Cuenta!" />
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginForm;
