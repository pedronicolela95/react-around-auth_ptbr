import React from "react";
import { Route, Switch, withRouter, useHistory } from "react-router-dom";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

import api from "../utils/api";
import { authorize, authenticate } from "../utils/auth";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App(props) {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);

  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState("");
  const [cards, setCards] = React.useState([]);

  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [InfoTooltipOpen, setInfoTooltipOpen] = React.useState(false);

  const history = useHistory();

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleAuthResponse() {
    setInfoTooltipOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setImagePopupOpen(true);
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setImagePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setInfoTooltipOpen(false);
    setSelectedCard("");
  }

  function authenticateWithToken(token) {
    console.log(token);
    return authenticate(token)
      .then((res) => {
        setEmail(res.data.email);
        setLoggedIn(true);
        return res;
      })
      .then((res) => {
        console.log(isLoggedIn);
        return res;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  function onLogin(email, password) {
    return authorize(email, password)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        return res;
      })
      .then((res) => {
        return authenticateWithToken(res.token);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  function onSignOut() {
    localStorage.removeItem("jwt");
    setEmail("");
    setLoggedIn(false);
  }

  React.useEffect(() => {
    api
      .getProfileInfo()
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    authenticateWithToken(localStorage.getItem("jwt"))
      .then((res) => {
        if (res.ok) {
          props.history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleUpdateUser(profileInfo) {
    api
      .updateProfileInfo(profileInfo)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(profileInfo) {
    api
      .updateProfileImage(profileInfo)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    // Verifique mais uma vez se esse cartão já foi curtido
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Envie uma solicitação para a API e obtenha os dados do cartão atualizados
    api.likeCard(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    });
  }

  function handleDeleteCard(card) {
    // Envie uma solicitação para a API e obtenha os dados do cartão atualizados
    api.deleteCard(card._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id));
    });
  }

  function handleAddNewCard(card) {
    // Envie uma solicitação para a API e obtenha os dados do cartão atualizados
    api
      .postCards(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header email={email} onSignOut={onSignOut} />
      <Switch history={history}>
        <Route exact path="/signup">
          <Register
            isOpen={InfoTooltipOpen}
            closeAllPopups={closeAllPopups}
            handleAuthResponse={handleAuthResponse}
          />
        </Route>
        <Route exact path="/signin">
          <Login
            onLogin={onLogin}
            isOpen={InfoTooltipOpen}
            closeAllPopups={closeAllPopups}
            handleAuthResponse={handleAuthResponse}
          />
        </Route>
        <ProtectedRoute
          path="/"
          loggedIn={isLoggedIn}
          component={Main}
          isEditProfilePopupOpen={isEditProfilePopupOpen}
          isAddPlacePopupOpen={isAddPlacePopupOpen}
          isEditAvatarPopupOpen={isEditAvatarPopupOpen}
          handleEditAvatarClick={handleEditAvatarClick}
          handleEditProfileClick={handleEditProfileClick}
          handleAddPlaceClick={handleAddPlaceClick}
          closeAllPopups={closeAllPopups}
          isImagePopupOpen={isImagePopupOpen}
          handleCardClick={handleCardClick}
          selectedCard={selectedCard}
          handleUpdateUser={handleUpdateUser}
          handleUpdateAvatar={handleUpdateAvatar}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleDeleteCard}
          handleAddNewCard={handleAddNewCard}
        />
      </Switch>
      <Footer />
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
