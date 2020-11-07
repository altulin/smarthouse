'use strict';

(function () {
  const adForm = document.querySelector(`.ad-form`);
  const guestNumberField = adForm.querySelector(`#capacity`);
  const roomNumberField = adForm.querySelector(`#room_number`);
  const sendDataForm = function (evt) {
    const formData = new FormData(adForm);
    window.backend.save(formData, loadSuccessful, window.backend.errorHandler);
    evt.preventDefault();
  };
  const loadSuccessful = function () {
    // adForm.classList.add(`ad-form--disabled`);
  };
  window.validity = {
    makeCheckFields() {
      const MIN_TITLE = 30;
      const MAX_TITLE = 100;
      const MAX_PRICE = 1000000;
      const titleField = adForm.querySelector(`#title`);
      const priceField = adForm.querySelector(`#price`);
      const typeField = adForm.querySelector(`#type`);
      const timeInField = adForm.querySelector(`#timein`);
      const timeOutField = adForm.querySelector(`#timeout`);
      const checkTitleField = function () {
        const titleValueLength = titleField.value.length;
        if (titleValueLength < MIN_TITLE) {
          titleField.setCustomValidity(`Ещё ` + (MIN_TITLE - titleValueLength) + ` симв.`);
        } else if (titleValueLength > MAX_TITLE) {
          titleField.setCustomValidity(`Удалите лишние ` + (titleValueLength - MAX_TITLE) + ` симв.`);
        } else {
          titleField.setCustomValidity(``);
        }
        titleField.reportValidity();
      };

      const Price = {
        bungalow: 0,
        flat: 1000,
        house: 5000,
        palace: 10000
      };

      const checkPriceField = function () {
        let priceMin = Price[typeField.value];
        if (priceField.value < priceMin) {
          priceField.setCustomValidity(`Минимальная стоимость: ${priceMin} руб.`);
        } else if (priceField.value > MAX_PRICE) {
          priceField.setCustomValidity(`Максимальная стоимость: ${MAX_PRICE} руб.`);
        } else {
          priceField.setCustomValidity(``);
        }
        priceField.reportValidity();
      };

      const checkTypeField = function () {
        priceField.placeholder = Price[typeField.value];
        checkPriceField();
      };

      const checkTimeInField = function () {
        Array.from(timeOutField.options)[timeInField.selectedIndex].selected = true;
      };

      const checkTimeOutField = function () {
        Array.from(timeInField.options)[timeOutField.selectedIndex].selected = true;
      };

      const checkRoomNumberField = function () {
        const optionsListGuests = Array.from(guestNumberField.options);
        const optionsListRooms = roomNumberField.options;
        optionsListGuests.forEach(function (item) {
          item.disabled = true;
        });
        if (optionsListRooms.selectedIndex === optionsListRooms.length - 1) {
          optionsListGuests[optionsListGuests.length - 1].disabled = false;
        } else if (optionsListRooms.selectedIndex === 0) {
          optionsListGuests[2].disabled = false;
        } else if (optionsListRooms.selectedIndex === 1) {
          optionsListGuests[1].disabled = false;
          optionsListGuests[2].disabled = false;
        } else if (optionsListRooms.selectedIndex === 2) {
          optionsListGuests[0].disabled = false;
          optionsListGuests[1].disabled = false;
          optionsListGuests[2].disabled = false;
        }
      };

      const checkGuestNumberField = function () {
        guestNumberField.setCustomValidity(``);
      };

      titleField.addEventListener(`input`, checkTitleField);
      priceField.addEventListener(`input`, checkPriceField);
      typeField.addEventListener(`change`, checkTypeField);
      timeInField.addEventListener(`input`, checkTimeInField);
      timeOutField.addEventListener(`input`, checkTimeOutField);
      roomNumberField.addEventListener(`input`, checkRoomNumberField);
      guestNumberField.addEventListener(`focus`, checkRoomNumberField);
      guestNumberField.addEventListener(`change`, checkGuestNumberField);
    },

    makeCheckSubmit(evt) {
      if (Number(roomNumberField.value) === 100 && Number(guestNumberField.value) === 0) {
        guestNumberField.setCustomValidity(``);
        sendDataForm(evt);
      } else if (Number(roomNumberField.value) >= Number(guestNumberField.value)
        && Number(roomNumberField.value) !== 100 && Number(guestNumberField.value) !== 0) {
        guestNumberField.setCustomValidity(``);
        sendDataForm(evt);
      } else {
        evt.preventDefault();
        guestNumberField.setCustomValidity(`Количество мест не соответсвует количеству гостей`);
      }
      guestNumberField.reportValidity();
    },

    adForm
  };
})();
