'use strict'
/**
 * Fachhochschule Wedel, Sommersemester 2021
 * Übung Web-Anwendungen
 * 
 * Globales Skript
 * 
 * @author Lukas Steen, Timo Peters
 * @date 17.06.2021
 */

const popupContent = document.querySelector(".popup__content");
const fetchApiSubmit = document.querySelector(".navigation__wishlist");
const popup = document.querySelector(".popup");

/**
 * Speicherung der Warteanimation.
 */
let waitHtml;

/**
 * Ermöglicht das Highlighting des Niedrigsten Preises in der Wunschliste.
 */
function lowestPrice() {
  const lowestPriceBtn = document.querySelector("#price-btn");
  if(lowestPriceBtn !== null) {
    lowestPriceBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const priceElems = [...document.querySelectorAll(".table__price")];
      const prices = priceElems.map(price => +price.dataset.price);
      const minPriceId = prices.indexOf(Math.min(...prices));
      priceElems[minPriceId].classList.toggle("highlight-price");
    });
  }
}

/**
 * Schließen der Wunschliste
 */
function closePopup() {
  const closePopup = document.querySelector(".popup__close");
  closePopup.addEventListener("click", () => {
    popup.classList.remove("popup__visible");
  });
}

/* Warteanimation laden */
fetch("/api/waitFragment")
  .then(response => response.text())
  .then(html => waitHtml = html);

/**
 * Öffnen und Laden der Wunschliste
 */
fetchApiSubmit.addEventListener("click", _ => {
  popup.classList.add("popup__visible");
  popupContent.innerHTML = waitHtml;

  // Anfragen des HTML Fragments der Wunschliste
  fetch("/api/fragment")
    .then(response => {
      return response.text();
    })
    .then(html => {
      popupContent.innerHTML = html;

      const errorDiv = document.querySelector(".table--error");
      errorDiv.classList.add("hide");

      lowestPrice();

      closePopup();
    })
    .catch(_ => {
      const errorDiv = document.querySelector(".table--error");
      errorDiv.classList.remove("hide");
    });
});

/**
 * Erstellung und Formatierung der Zeit
 */
const footerDate = document.querySelector(".footer__date");
const locale = footerDate.dataset.locale;

const time = () => {
  footerDate.innerHTML = new Date().toLocaleString(locale);
}

// Erstmalieger Aufruf um Verzögerung zu vermeiden.
time();
setInterval(time, 16.7);