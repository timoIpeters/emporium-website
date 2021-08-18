'use strict'
/**
 * Fachhochschule Wedel, Sommersemester 2021
 * Übung Web-Anwendungen
 * 
 * Hinzufügen der Funktionalitäten der Herzicons (siehe Overview, Detail)
 * 
 * @author Lukas Steen, Timo Peters
 * @date 17.06.2021
 */

const hearts = document.querySelectorAll(".add-to-wishlist");

/**
 * Hinzufügen des Clickevents zu jedem Herz.
 */
hearts.forEach(heart => {
  heart.addEventListener("click", () => {
    const data = {
      id: +heart.dataset.id
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }

    // Sender der productID des angeklickten Produkts an den Server
    fetch("/api/toggleWishlist", options)
      .then(response => {

        if(response.ok) {
          // Anfragen der richtigen Darstellung des Herzicons
          fetch("/api/heartFragment")
            .then(response => response.text())
            .then(html => heart.innerHTML = html);
        }
      })
      .catch(error => {
        alert("Adding to the wishlist was not possible");
      });
  });
});