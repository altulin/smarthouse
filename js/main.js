'use strict';
const mapFilters = document.querySelector(`.map__filters`);
const adFormElements = Array.from(window.validity.adForm.querySelectorAll(`fieldset`));
const mapFiltersElements = Array.from(mapFilters.children);

const addDisabled = function (array) {
  array.forEach(function (elem) {
    elem.setAttribute(`disabled`, true);
  });
};

const removeDisabled = function (array) {
  array.forEach(function (elem) {
    elem.removeAttribute(`disabled`);
  });
};

const activatePage = function () {
  window.pin.blockMap.classList.remove(`map--faded`);
  window.validity.adForm.classList.remove(`ad-form--disabled`);
  removeDisabled(adFormElements);
  removeDisabled(mapFiltersElements);
  window.move.mainPin.removeEventListener(`mousedown`, onMainPinMouseDown);
  window.move.mainPin.removeEventListener(`keydown`, onMainPinEnterDown);
  window.pin.mapPins.addEventListener(`mousedown`, window.card.onPinMouseDown);
  window.pin.mapPins.addEventListener(`keydown`, window.card.onPinEnterDown);
  window.validity.makeCheckFields();
  window.validity.adForm.addEventListener(`submit`, window.validity.makeCheckSubmit);
  window.backend.load(window.pin.handlerSuccess, window.backend.errorHandler);
};

const onMainPinMouseDown = function (evt) {
  window.util.isMouseEvent(evt, activatePage);
};

const onMainPinEnterDown = function (evt) {
  window.util.isEnterEvent(evt, activatePage);
};

const main = function () {
  addDisabled(adFormElements);
  addDisabled(mapFiltersElements);
  window.move.setAddressToField();
  window.move.mainPin.addEventListener(`mousedown`, onMainPinMouseDown);
  window.move.mainPin.addEventListener(`keydown`, onMainPinEnterDown);
};
main();
