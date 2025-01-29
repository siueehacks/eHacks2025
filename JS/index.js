window.addEventListener('load', async () => {
    // Listen for terminal input
    const input = document.getElementById('terminal-input-input');
    // Autofocus terminal
    input.focus();
    input.addEventListener('keypress', ({ key }) => {
        if (key == "Enter") {
            if (input.value == "") {
                return;
            }
            processCommand(input.value);
        }
    });
});
let prefix = "guest@eHacks2025:/home";
function processCommand(commandString = "") {
    const validCommands = ["cd", "ls", "help", "clear"];
    const input = document.getElementById('terminal-input-input');
    const output = document.getElementById('terminal-output');
    // Check if command is valid
    const commandSplit = commandString.split(" ");
    const command = commandSplit[0];
    const args = commandSplit.slice(1);
    if (!validCommands.includes(command)) {
        toConsole("Invalid command", true);
        input.value = "";
        return false;
    }
    // process commands
    if (command == "clear") {
        output.innerHTML = `
                    Welcome to eHacks 2025!
            <br>
            Here you can view info, register, manage your registration, and more.
            <br>
            There could be some interesting things to find within this page.
            <br>
        `;
    } else if (command == "cd") {
        // check for args
        const validArgs = [
            {
                name: "games",
                contains: [
                    {
                        name: "TicTacToe",
                        type: "exec"
                    },
                    {
                        name: "Connect4",
                        type: "exec"
                    },
                    {
                        name: "MatchMemory",
                        type: "exec"
                    }
                ],
                type: "directory"
            }
        ];
        if (!validArgs.includes(args[0])) {
            toConsole(`Invalid argument ("${args[0]}") for command "cd"`, true);
            input.value = "";
            return false;
        }
        // Change prefix, header text, and label
        prefix = `guest@eHacks2025:/`
    }
    input.value = "";
    return true;
}

function toConsole(message = "", isError = false) {
    const output = document.getElementById('terminal-output');
    const breakElement = document.createElement('br');
    output.appendChild(breakElement);
    let textElement;
    textElement = document.createElement('span');
    if (isError) {
        textElement.className = "errorMessage";
    }
    textElement.innerHTML = `<span class="terminalUser">${prefix}</span> $ ${isError ? "Error: " : ""}${message}`;
    output.appendChild(textElement);
    // scroll to bottom
    output.scrollTop = output.scrollHeight;
}