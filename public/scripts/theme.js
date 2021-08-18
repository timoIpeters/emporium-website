// Auswahl des preferisierten Farbschemas basierend auf das perfers-color-scheme
// Attribut des browsers und die momentane Selektion im localStorage 
const storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
const header = document.querySelector(".header");

if (storedTheme)
  document.documentElement.setAttribute('data-theme', storedTheme)


// Tastenkombination zum Wechseln zwischen light- & darkmode
document.addEventListener("keydown", (event) => {
  if(event.ctrlKey && event.altKey && (event.code === "KeyT")) {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    let targetTheme = "light";

    if (currentTheme === "light") {
        targetTheme = "dark";
    }

    // theme wird ueber das data-theme Attribut des html-Elements gesetzt
    document.documentElement.setAttribute('data-theme', targetTheme)
    localStorage.setItem('theme', targetTheme);
  }
})