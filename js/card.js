'use strict';
(function () {
  const hotelTypesRu = [`Дворец`, `Квартира`, `Дом`, `Бунгало`];
  const hotelTypes = [`palace`, `flat`, `house`, `bungalow`];
  let btnPopapClose;

  const onEscPopapCloseListener = function (evt) {
    window.util.isEscEvent(evt, closePinCard);
  };

  const onBtnPopapCloseMouseDown = function (evt) {
    window.util.isMouseEvent(evt, closePinCard);
  };

  const onBtnPopapCloseEnterDown = function (evt) {
    window.util.isEnterEvent(evt, closePinCard);
  };

  const onPinMouseDown = function (evt) {
    window.util.isMouseEvent(evt, function () {
      openPinCard(evt);
      if (evt.target.parentElement.matches(`.map__pin--main`)) {
        window.move.onMovingPin(evt);
      }
    });
  };

  const onPinEnterDown = function (evt) {
    window.util.isEnterEvent(evt, function () {
      openPinCard(evt);
    });
  };

  const openPinCard = function (evt) {
    let buttonPin;
    if (evt.target.tagName === `BUTTON`) {
      buttonPin = evt.target;
    } else {
      buttonPin = evt.target.parentElement;
    }
    if (!buttonPin.matches(`.map__pin--main`) && buttonPin.matches(`.map__pin`)) {
      closePinCard();
      window.card.renderOffer(window.pin.arrayPins[buttonPin.dataset.number]);
      btnPopapClose = window.pin.blockMap.querySelector(`.popup__close`);
      btnPopapClose.addEventListener(`mousedown`, onBtnPopapCloseMouseDown);
      btnPopapClose.addEventListener(`keydown`, onBtnPopapCloseEnterDown);
      document.addEventListener(`keydown`, onEscPopapCloseListener);
    }
  };

  const closePinCard = function () {
    if (window.pin.blockMap.querySelector(`.map__card`) !== null) {
      window.pin.blockMap.querySelector(`.map__card`).remove();
      btnPopapClose.removeEventListener(`mousedown`, onBtnPopapCloseMouseDown);
      btnPopapClose.removeEventListener(`keydown`, onBtnPopapCloseEnterDown);
      document.removeEventListener(`keydown`, onEscPopapCloseListener);
    }
  };

  window.card = {
    renderOffer(item) {
      const similarCardTemplate = document.querySelector(`#card`)
        .content
        .querySelector(`.map__card`);
      const cardElement = similarCardTemplate.cloneNode(true);
      const photos = item.offer.photos;
      const photosFragment = document.createDocumentFragment();
      const photosElement = cardElement.querySelector(`.popup__photos`);
      const parentFeatures = cardElement.querySelector(`.popup__features`);
      cardElement.querySelector(`.popup__title`).textContent = item.offer.title;
      cardElement.querySelector(`.popup__text--address`).textContent = item.offer.address;
      cardElement.querySelector(`.popup__text--price`).textContent = `${item.offer.price}₽ / ночь`;
      cardElement.querySelector(`.popup__type`).textContent =
      hotelTypesRu[hotelTypes.indexOf(item.offer.type)];
      cardElement.querySelector(`.popup__text--capacity`).textContent =
        `${item.offer.rooms} комнаты для ${item.offer.guests} гостей`;
      cardElement.querySelector(`.popup__text--time`).textContent =
        `заезд после ${item.offer.checkin}, выезд до ${item.offer.checkout}`;
      cardElement.querySelector(`.popup__description`).textContent = item.offer.description;
      cardElement.querySelector(`.popup__avatar`).src = item.author.avatar;
      if (item.offer.features.length === 0) {
        parentFeatures.remove();
      } else {
        const childFeatures = Array.from(parentFeatures.querySelectorAll(`.popup__feature`));
        childFeatures.forEach(function (elem) {
          if (!item.offer.features.includes(elem.classList[1].split(`--`)[1])) {
            elem.remove();
          }
        });
      }
      if (photos.length === 0) {
        photosElement.remove();
      } else {
        for (let n = 0; n < photos.length; n++) {
          const newPhoto = cardElement.querySelector(`.popup__photo`).cloneNode(true);
          newPhoto.src = photos[n];
          photosFragment.appendChild(newPhoto);
        }
        photosElement.querySelector(`.popup__photo`).remove();
        photosElement.appendChild(photosFragment);
      }
      window.pin.blockMap.insertBefore(cardElement, document.querySelector(`.map__filters-container`));
    },

    onPinEnterDown,
    onPinMouseDown
  };
})();
