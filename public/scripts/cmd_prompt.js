/* Anzeigen/Ausblenden der Kommandozeile */
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.altKey && (event.code === "KeyP")) {
    const cmdPrompt = document.querySelector(".cmd_prompt");
    const input = document.querySelector("#cmd_prompt__input");
    cmdPrompt.classList.toggle("cmd-prompt--active");
    input.focus();
    input.value = ">";
  }
});

/* Auswahl und Validierung des Kommandos */
const input = document.querySelector(".cmd_prompt__input");
input.addEventListener("keypress", ((event) => {
  if (event.key === "Enter") {
    let cmdRaw = input.value.trim().split(" ");

    if (cmdRaw === 0 || cmdRaw[0].charAt(0) !== ">") {
      return;
    }

    const cmd = cmdRaw.shift().substr(1).toLowerCase();
    
    if (Object.keys(commands).includes(cmd)) {
        commands[cmd](cmdRaw);
    }

    input.value = ">";
  }
}));

/* Help Message */
const help_msg = `Available commands:\n\n>help -> Shows available commands\n>invert -> Sets the current theme to invert\n>theme [dark/light/invert] -> Sets the corresponding theme`

/* Object mit allen verfühgbaren Kommands. */
const commands = {

    /* Ändert des Theme auf invert */
    invert: (_) => {
      let themeName = "invert";
      document.documentElement.setAttribute('data-theme', themeName)
      localStorage.setItem('theme', themeName);
    },

    /* Setzt das Theme auf das als Argument angegebene Theme */
    theme: (args) => {
        if (args[0] !== undefined && (args[0] === "light" || args[0] === "dark" || args[0] === "invert") ) {
            document.documentElement.setAttribute('data-theme', args[0])
            localStorage.setItem('theme', args[0]);
        }
    },

    /* Gibt die Help message als Alert aus. */
    help: (_) => {
        alert(help_msg);
    }
}