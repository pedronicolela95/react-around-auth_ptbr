import React, { useState } from "react";
import { register } from "../utils/auth.js";
import InfoTooltip from "./InfoTooltip.js";
import { withRouter } from "react-router-dom";

function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onRegister = (event) => {
    event.preventDefault();
    register(email, password)
      .then((res) => {
        setEmail("");
        setPassword("");
        setSuccess(true);
      })
      .catch((error) => {
        setSuccess(false);
        console.log(error);
      })
      .finally(() => {
        props.handleAuthResponse();
      });
  };

  const handleClosePopup = () => {
    props.closeAllPopups();
    if (isSuccess) {
      props.history.push("/signin");
    }
  };

  return (
    <>
      <InfoTooltip
        isSuccess={isSuccess}
        isOpen={props.isOpen}
        name="register"
        onClose={handleClosePopup}
      />
      <form className="login" onSubmit={onRegister}>
        <h1 className="login__header">Inscrever-se</h1>
        <input
          className="login__input"
          id="email"
          placeholder="E-mail"
          value={email}
          required
          onChange={handleEmailChange}
        />
        <input
          className="login__input"
          id="password"
          placeholder="Senha"
          type="password"
          value={password}
          required
          onChange={handlePasswordChange}
        />
        <button className="login__button" type="submit">
          Inscrever-se
        </button>
        <a className="login__subtitle" href="/signin">
          Já é um membro? Faça o login aqui!
        </a>
      </form>
    </>
  );
}
export default withRouter(Register);
