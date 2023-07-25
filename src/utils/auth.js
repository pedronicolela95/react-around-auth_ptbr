export const BASE_URL = "https://register.nomoreparties.co";

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        return response.json().then((data) => {
          const error = new Error(
            "Um dos campos foi preenchido incorretamente "
          );
          error.statusCode = 400;
          throw error;
        });
      }
    })
    .catch((error) => {
      if (error.status !== 500) {
        return { statusCode: error.statusCode, message: error.message };
      }
      return {
        statusCode: error.statusCode,
        message: "Ocorreu um erro no servidor",
      };
    });
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.user) {
        localStorage.setItem("jwt", data.jwt);

        return data;
      }
    })
    .catch((error) => {
      if (error.statusCode === 400) {
        return error
          .status(error.statusCode)
          .send({ message: "Um ou mais campos não foram fornecidos" });
      }
      if (error.statusCode === 401) {
        return error.status(error.statusCode).send({
          message: "O usuário com o e-mail especificado não encontrado",
        });
      }
      return error.status(500).send({ message: "Ocorreu um erro no servidor" });
    });
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => {
      if (error.statusCode === 400) {
        return error.status(error.statusCode).send({
          message: "Token não fornecido ou fornecido em formato errado",
        });
      }
      if (error.statusCode === 401) {
        return error.status(error.statusCode).send({
          message: "O token fornecido é inválido",
        });
      }
      return error.status(500).send({ message: "Ocorreu um erro no servidor" });
    });
};
