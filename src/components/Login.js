import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission, e.g., sending email and password to the server for authentication
    console.log("Email:", email);
    console.log("Password:", password);
    // You can perform further actions, such as making an API call to authenticate the user
  };

  return (
    <>
      <form className="login" onSubmit={handleSubmit}>
        <h1 className="login__header">Entrar</h1>
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
          Entrar
        </button>
        <a className="login__subtitle" href="/signup">
          Ainda não é membro? Inscreva-se aqui!
        </a>
      </form>
    </>
  );
}
export default Login;
