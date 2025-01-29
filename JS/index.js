// // Disable right-click (context menu)
// document.addEventListener('contextmenu', function (event) {
//     event.preventDefault();
// });

// // Disable F12 key (Developer Tools)
// document.addEventListener('keydown', function (event) {
//     if (event.key === 'F12' || event.key === 'I' && event.ctrlKey) {
//         event.preventDefault();
//     }
// });

// const validCommands = ["cd", "ls", "help", "clear"];
const validCommands = [
    {
        name: "cd",
        description: "Navigate to directory.",
        example: "cd /games/TicTacToe"
    },
    {
        name: "ls",
        description: "Show directories and files in current directory.",
        example: "ls"
    },
    {
        name: "help",
        description: "View this message again.",
        example: "help"
    },
    {
        name: "clear",
        description: "Reset the terminal display.",
        example: "clear"
    }
];
let currentPath = "home/games";
let inGame = false;
let currentGame = "";
let controller;
window.addEventListener('load', async () => {
    // Listen for terminal input
    const input = document.getElementById('terminal-input-input');
    const output = document.getElementById('terminal-output');
    // Autofocus terminal
    input.focus();
    // Print out available commands
    const commandText = `<br>Available Commands:<br>${validCommands.map((command, i) => `<span class="terminalCommand">${command.name}</span>: ${command.description}<br>Example: ${command.example}`).join("<br><br>")}`
    output.innerHTML += commandText;
    // Listen for enter on terminal input
    input.addEventListener('keypress', ({ key }) => {
        if (key == "Enter") {
            if (input.value == "") {
                return;
            }
            processCommand(input.value);
        }
    });
});
let prefix = "guest@eHacks2025:/" + currentPath;
function processCommand(commandString = "") {
    const input = document.getElementById('terminal-input-input');
    const output = document.getElementById('terminal-output');
    // Check if command is valid
    const commandSplit = commandString.split(" ");
    const command = commandSplit[0];
    const args = commandSplit.slice(1);
    if (!validCommands.find(c => c.name == command) && !["TicTacToe.out", "Connect4.out", "MatchMemory.out", "IIll.out", "IllI.out", "lllI.out"].includes(command) && inGame === false) {
        toConsole("Invalid command", true);
        input.value = "";
        return false;
    }
    const validDirs = {
        home: {
            name: "home",
            games: {
                name: "games",
                TicTacToe: {
                    name: "TicTacToe.out",
                    type: "exec"
                },
                Connect4: {
                    name: "Connect4.out",
                    type: "exec"
                },
                MatchMemory: {
                    name: "MatchMemory.out",
                    type: "exec"
                },
                type: "directory"
            },
            IlIlIlIl: {
                name: "IlIlIlIl",
                IIlllllI: {
                    name: "IIlllllI.out",
                    type: "exec"
                },
                IllIIIll: {
                    name: "IllIIIll.out",
                    type: "exec"
                },
                lllIIllI: {
                    name: "lllIIllI.out",
                    type: "exec"
                },
                type: "directory"
            },
            type: "directory"

        }
    };

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
        if (args.length == 0) {
            toConsole("Invalid command", true);
            input.value = "";
            return false;
        }
        // Check for pathing
        let path = currentPath.split("/");
        if (args[0].startsWith("/")) {
            args[0] = args[0].trim().slice(1);
        }
        const argSplit = currentPath.split("/").concat(args[0].split("/"));
        // Check if input has ../
        if (args[0].includes("../")) {
            let newArray = [];
            for (let i = 0; i < path.length; i++) {
                const dir = path[i].trim();
                if (i < path.length - (args[0].match(/\.\.\//g) || []).length) {
                    newArray.push(dir);
                }
            };
            if (newArray.length === 0) {
                toConsole("Invalid command", true);
                input.value = "";
                return false;
            }
            path = newArray;
        } else {
            let newArray = ['home'];
            let targetDir = validDirs['home'];
            for (let i = 1; i < argSplit.length; i++) {
                const arg = argSplit[i].trim();
                // Check for first dir
                targetDir = targetDir[arg];
                if (targetDir && targetDir.type === "directory") {
                    // Check dir contents for arg
                    newArray.push(arg);
                } else {
                    toConsole("This dir doesn't exist: /" + path.join("/") + "/" + args[0], true);
                    input.value = "";
                    return false;
                }
            };
            path = newArray;
        }
        currentPath = path.join("/");
        // console.log('path: ', currentPath)
        // Change prefix, header text, and label
        prefix = `guest@eHacks2025:/${currentPath}`;
        const terminalHeader = document.getElementById('terminal-header-location-text');
        const inputLabel = document.getElementById('terminal-input-label');
        terminalHeader.innerHTML = prefix;
        inputLabel.innerHTML = prefix;
        toConsole(commandString, false);
    } else if (command == "ls") {
        let text = "";
        // get current dir
        let currentDir = validDirs;
        for (let i = 0; i < currentPath.split("/").length; i++) {
            currentDir = currentDir[currentPath.split("/")[i]];
        }
        Object.keys(currentDir).forEach((key) => {
            if (key !== "name" && key !== "type") {
                let spanType;
                if (currentDir[key].type === "directory") {
                    spanType = "terminalDir";
                } else if (currentDir[key].type === "exec") {
                    spanType = "terminalExec";
                }
                text += `<span class="${spanType} specialFont">${currentDir[key].name}</span>&nbsp;&nbsp;&nbsp;`
            }
        })
        toConsole(commandString, false);
        output.innerHTML += text;
        scrollToBottom();
    } else if (command == "help") {
        // Print out available commands
        toConsole(commandString, false);
        const commandText = `Available Commands:<br>${validCommands.map((command, i) => `<span class="terminalCommand">${command.name}</span>: ${command.description}<br>Example: ${command.example}`).join("<br><br>")}`
        output.innerHTML += commandText;
        scrollToBottom();
    } else if (["TicTacToe.out", "Connect4.out", "MatchMemory.out", "IIll.out", "IllI.out", "lllI.out"].includes(command) || inGame === true) {
        // Check if in games dir
        if (["TicTacToe.out", "Connect4.out", "MatchMemory.out"].includes(command) || inGame === true) {
            if (commandString === "exit") {
                inGame = false;
                currentGame = "";
                toConsole(commandString, false);
                input.value = "";
                return;
            }
            // /home/games
            if (command === "TicTacToe.out") {
                if (inGame === true) {
                    toConsole(`It is currently ${controller.currentTurn.name}\'s turn. You can quit by using exit`, true);
                    input.value = "";
                    return false;
                }
                controller = new TicTacToe("Player1", "Player2");
                toConsole(commandString, false);
                output.innerHTML += `<br><span class="terminalTitle">TicTacToe</span><br>${controller.printBoard()}`;
                inGame = true;
                currentGame = "TicTacToe";
                // Explain rules
                output.innerHTML += `<br>The rules are simple get three in a row either vertically or horizontally. When it is your turn enter a number (1-9) corresponding to a spot on the board.<br><br> ${controller.currentTurn.name}\'s turn:`;
                scrollToBottom();
            } else if (command === "Connect4.out") {
                if (inGame === true) {
                    toConsole(`It is currently ${controller.currentTurn.name}\'s turn. You can quit by using exit`, true);
                    input.value = "";
                    return false;
                }
                controller = new Connect4("Player1", "Player2");
                toConsole(commandString, false);
                output.innerHTML += `<br><span class="terminalTitle">Connect4</span><br>${controller.printBoard()}`;
                inGame = true;
                currentGame = "Connect4";
                // Explain rules
                output.innerHTML += `<br>The rules are simple get four in a row either vertically, horizontally, or diagnolly. When it is your turn enter a number (1-7) corresponding to a column (vertical line) on the board.<br><br> ${controller.currentTurn.name}\'s turn:`;
                scrollToBottom();
            } else if (command === "MatchMemory.out") {

            } else if (currentGame === "TicTacToe") {
                const num = parseInt(commandString) - 1;
                if (num > 8 || num < 0) {
                    toConsole(`Invalid input.`, true);
                    input.value = "";
                    return false;
                }
                const col = num % 3;
                const row = Math.floor(num / 3);
                // Check if spot taken already
                if (controller.board[row][col] === controller.player1.symbol || controller.board[row][col] === controller.player2.symbol) {
                    toConsole(`That spot is already taken.`, true);
                    input.value = "";
                    return false;
                }
                const oldTurnPlayer = controller.setSpace(col, row, controller.currentTurn);
                output.innerHTML += `<br>${controller.printBoard()}`;
                if (controller.checkForWin(oldTurnPlayer)) {
                    output.innerHTML += `${oldTurnPlayer.name} has won!`;
                    inGame = false;
                    currentGame = "";
                    controller = null;
                    scrollToBottom();
                    input.value = "";
                    return;
                }
                if (controller.turnCount === 9) {
                    output.innerHTML += `It ended in a tie!`;
                    inGame = false;
                    currentGame = "";
                    controller = null;
                    scrollToBottom();
                    input.value = "";
                    return;
                }
                output.innerHTML += `${controller.currentTurn.name}\'s turn:`;
                scrollToBottom();
            } else if (currentGame === "Connect4") {
                const num = parseInt(commandString) - 1;
                if (num > 6 || num < 0) {
                    toConsole(`Invalid input.`, true);
                    input.value = "";
                    return false;
                }
                const col = num;
                const row = Math.floor(num / 3);
                if (controller.board[0][col] === controller.player1.symbol || controller.board[0][col] === controller.player2.symbol) {
                    toConsole(`This column is full.`, true);
                    input.value = "";
                    return false;
                }
                const oldTurnPlayer = controller.setSpace(col, controller.currentTurn);
                output.innerHTML += `<br>${controller.printBoard()}`;
                if (controller.checkForWin(oldTurnPlayer)) {
                    output.innerHTML += `${oldTurnPlayer.name} has won!`;
                    inGame = false;
                    currentGame = "";
                    controller = null;
                    scrollToBottom();
                    input.value = "";
                    return;
                }
                if (controller.turnCount === 42) {
                    output.innerHTML += `It ended in a tie!`;
                    inGame = false;
                    currentGame = "";
                    controller = null;
                    scrollToBottom();
                    input.value = "";
                    return;
                }
                output.innerHTML += `${controller.currentTurn.name}\'s turn:`;
                scrollToBottom();
            }
        } else {
            // /home/IIII
            if (command === "IIll.out") {

            } else if (command === "IllI.out") {

            } else if (command === "lllI.out") {

            }
        }
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
    textElement.innerHTML = `<span class="terminalUser">${prefix}</span> $ ${isError ? "Error: " : ""}${message}<br>`;
    output.appendChild(textElement);
    // scroll to bottom
    scrollToBottom();
}

function scrollToBottom() {
    const output = document.getElementById('terminal-output');
    output.scrollTop = output.scrollHeight;
}

class TicTacToe {
    player1 = {
        score: 0,
        symbol: "✖️",
        name: ""
    };
    player2 = {
        score: 0,
        symbol: "🟣",
        name: ""
    }
    turnCount = 0;
    board = [["1️⃣", "2️⃣", "3️⃣"], ["4️⃣", "5️⃣", "6️⃣"], ["7️⃣", "8️⃣", "9️⃣"]];
    // board = [["✖️", "🟣", "✖️"], ["✖️", "✖️", "⬛"], ["✖️", "⬛", "⬛"]];
    currentTurn = this.player1;
    constructor(player1Name, player2Name) {
        this.player1.name = player1Name;
        this.player2.name = player2Name;
    }

    printBoard() {
        let text = "<br>";
        text += `${this.board.map((v, i) => v.join("┃")).join("<br>━━━━━━━━━<br>")}<br><br>`;
        return text;
    }

    setSpace(column, row, player) {
        this.board[row][column] = player.symbol;
        this.currentTurn = (player == this.player1) ? this.player2 : this.player1;
        this.turnCount++;
        return player;
    }

    checkForWin(player) {
        const rows = this.board.length;
        const cols = this.board[0].length;

        function checkDirection(r, c, dr, dc, board) {
            for (let i = 1; i < 3; i++) {
                let nr = r + dr * i;
                let nc = c + dc * i;
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || board[nr][nc] !== player.symbol) {
                    return false;
                }
            }
            return true;
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (this.board[r][c] !== player.symbol) continue;
                if (
                    checkDirection(r, c, 0, 1, this.board) ||  // Horizontal
                    checkDirection(r, c, 1, 0, this.board) ||  // Vertical
                    checkDirection(r, c, 1, 1, this.board) ||  // Diagonal (\)
                    checkDirection(r, c, 1, -1, this.board)   // Diagonal (/)
                ) {
                    return true;
                }
            }
        }
        return false;
    }
}

class Connect4 {
    player1 = {
        score: 0,
        symbol: "🔴",
        name: ""
    };
    player2 = {
        score: 0,
        symbol: "🟢",
        name: ""
    }
    turnCount = 0;
    board = [
        ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"],
        ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"],
        ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"],
        ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"],
        ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"],
        ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"]
    ];
    currentTurn = this.player1;
    constructor(player1Name, player2Name) {
        this.player1.name = player1Name;
        this.player2.name = player2Name;
    }

    printBoard() {
        let text = "<br>";
        text += `┃${this.board.map((v, i) => v.join("┃")).join("┃<br>┃")}┃<br><br>`;
        return text;
    }

    setSpace(column, player) {
        // Set last empty space in column to player symbol
        for (let row = 0; row < this.board.length; row++) {
            // Check if row is empty
            if (this.board[row][column] !== "⚫") {
                this.board[row - 1][column] = player.symbol;
                break;
            } else if (row === this.board.length - 1) {
                this.board[row][column] = player.symbol;
                break;
            }
        }
        this.currentTurn = (player == this.player1) ? this.player2 : this.player1;
        this.turnCount++;
        return player;
    }

    checkForWin(player) {
        const rows = this.board.length;
        const cols = this.board[0].length;

        function checkDirection(r, c, dr, dc, board) {
            for (let i = 1; i < 4; i++) {
                let nr = r + dr * i;
                let nc = c + dc * i;
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || board[nr][nc] !== player.symbol) {
                    return false;
                }
            }
            return true;
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (this.board[r][c] !== player.symbol) continue;
                if (
                    checkDirection(r, c, 0, 1, this.board) ||  // Horizontal
                    checkDirection(r, c, 1, 0, this.board) ||  // Vertical
                    checkDirection(r, c, 1, 1, this.board) ||  // Diagonal (")
                    checkDirection(r, c, 1, -1, this.board)   // Diagonal (/)
                ) {
                    return true;
                }
            }
        }
        return false;
    }
}