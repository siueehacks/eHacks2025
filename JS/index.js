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
let validDirs = {
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
            type: "directory"
        },
        type: "directory"

    }
};
let currentPath = "home";
let inGame = false;
let currentGame = "";
let controller;
let secretCode = null;
let eeId = null;
let savedeeId = null;
let terminalEEMultiplier = 1;
window.addEventListener('load', async () => {
    // Disable right-click (context menu)
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });

    // Disable F12 key (Developer Tools)
    document.addEventListener('keydown', function (event) {
        if (event.key === 'F12' || event.key.toLowerCase() === 'i' && event.ctrlKey || event.key.toLowerCase() === "u" && event.ctrlKey) {
            event.preventDefault();
        }
    });
    const { apiURL, faqQuestions } = await (await fetch('/JS/config.json')).json();
    // Get sessionID and save it to session Data
    const cookies = document.cookie.split(" ").map((cookie, i) => {
        return {
            key: cookie.trim().split(";").join("").split("=")[0],
            value: cookie.trim().split(";").join("").split("=")[1]
        }
    });
    // Set terminal easter egg difficulty multiplier
    const terminalEECookie = parseInt(cookies.find((c) => c.key === "terminalEE")?.value);
    const terminalEECookie2 = parseInt(window.localStorage.getItem("terminalEE"));
    const terminalEECookie3 = parseInt(window.sessionStorage.getItem("terminalEE"));
    if (terminalEECookie || terminalEECookie2 || terminalEECookie3) {
        let highestValue = 1;
        if (isNaN(terminalEECookie) || isNaN(terminalEECookie2) || isNaN(terminalEECookie3)) {
            // One was tampered with increase multiplier on all
            const checkValues = [terminalEECookie, terminalEECookie2, terminalEECookie3];
            for (let i = 0; i < 3; i++) {
                if (checkValues[i] > highestValue) {
                    highestValue = checkValues[i];
                }
            }
            highestValue++;
            document.cookie = "terminalEE=" + highestValue;
            window.localStorage.setItem("terminalEE", highestValue);
            window.sessionStorage.setItem("terminalEE", highestValue);
        }
        terminalEEMultiplier = highestValue;
    } else {
        // deleteAllCookies();
        document.cookie = "terminalEE=1";
        window.localStorage.setItem("terminalEE", 1);
        window.sessionStorage.setItem("terminalEE", 1);
    }
    // Generate dir files for easter egg
    const dirChars = ["I", "l"];
    for (let i = 0; i < (terminalEEMultiplier * 3); i++) {
        let dirName = "";
        for (let x = 0; x < (terminalEEMultiplier * 8); x++) {
            dirName += dirChars[getRandomInt(0, 1)];
        }
        validDirs["home"]["IlIlIlIl"][dirName] = {
            name: `${dirName}.out`,
            winner: false,
            type: "exec"
        };
    };
    // Assign winner file
    const dirsLength = Object.keys(validDirs["home"]["IlIlIlIl"]).filter((d) => !["name", "type"].includes(d)).length
    const winnerDir = Object.keys(validDirs["home"]["IlIlIlIl"]).filter((d) => !["name", "type"].includes(d))[getRandomInt(0, dirsLength - 1)];
    validDirs["home"]["IlIlIlIl"][winnerDir]['winner'] = true;
    // console.log(validDirs["home"]["IlIlIlIl"])
    // Listen for terminal input
    const input = document.getElementById('terminal-input-input');
    const output = document.getElementById('terminal-output');
    // Autofocus terminal
    // input.focus();
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
    // Listen for code redeem
    const codeBox = document.getElementById('redemption-box');
    const codeInput = document.getElementById('redemption-box-input');
    const codeButton = document.getElementById('redemption-box-button');
    const nameBox = document.getElementById('name-box');
    const nameInput = document.getElementById('name-box-input');
    const emailButton = document.getElementById('name-box-button');
    codeButton.addEventListener('click', async () => {
        // Check if input is wrong
        if (codeInput.value !== secretCode) {
            return;
        }
        // save eeId
        savedeeId = eeId;
        codeBox.style.display = "none";
        nameBox.style.display = "flex";
    });
    emailButton.addEventListener('click', async () => {
        // Check if input is wrong
        if (nameInput.value == "") {
            return;
        }
        const redeemReq = await fetch(`${apiURL}/coderedemption`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify({
                email: nameInput.value,
                eeId: savedeeId
            })
        });
        const redeemRes = await redeemReq.json();
        if (!redeemRes.success) {
            alert(redeemRes.error);
            return;
        }
        alert("Come find the organizer Adam to claim your reward.");
        nameBox.style.display = "none";
    });
    const logoTopLeft = document.getElementById('logo-1');
    const logoTopRight = document.getElementById('logo-2');
    const logoBottomLeft = document.getElementById('logo-3');
    const logoBottomRight = document.getElementById('logo-4');
    const bodyElement = document.getElementById('body');
    const code2Element = document.getElementById('code-2');
    let showing = false;
    logoTopLeft.addEventListener('click', () => {
        if (secretCode == null) {
            if (!showing) {
                showing = true;
                logoTopRight.style.display = "flex";
                logoBottomLeft.style.display = "flex";
                logoBottomRight.style.display = "flex";
                codeBox.style.display = "flex";
            } else {
                showing = false;
                logoTopRight.style.display = "none";
                logoBottomLeft.style.display = "none";
                logoBottomRight.style.display = "none";
                codeBox.style.display = "none";
            }
        }
    });
    let lightMode = false;
    logoTopRight.addEventListener('click', () => {
        if (secretCode == null) {
            if (!lightMode) {
                bodyElement.style.backgroundColor = "var(--offwhite)";
                lightMode = true;
                code2Element.innerHTML = `Secret Code 2: ${getSecretCode(2)}`;

            } else {
                bodyElement.style.backgroundColor = "";
                lightMode = false;
                code2Element.innerHTML = "";
                secretCode = null;
                eeId = null;
            }
        }
    });
    logoBottomRight.addEventListener('click', () => {
        if (secretCode == null) {
            const code = getSecretCode(3).split("");
            for (let i = 0; i < code.length; i++) {
                const num = document.getElementById(`code-3-${i}`);
                num.innerHTML = code[i];
                setTimeout(() => {
                    num.style.display = "block";
                    setTimeout(() => {
                        num.style.display = "";
                    }, 10000);
                }, 1500 * i);
            }
        }
    });
    logoBottomLeft.addEventListener('click', () => {
        if (secretCode == null) {
            document.title = `Code: ${getSecretCode(4)}`;
            setTimeout(() => {
                document.title = "eHacks 2025";
            }, 60_000);
        }
    });
    // Gallery
    setInterval(() => {
        changeImage(1);
    }, 10_000);
    // Get schedule data

    const scheduleReq = await fetch(`${apiURL}/schedule`, {
        method: "GET",
        credentials: "include" // Important for session cookies
    });
    const scheduleRes = await scheduleReq.json();
    if (scheduleRes.success) {
        const events = scheduleRes.data.map((data, i) => {
            const startTime = new Date(data.start.dateTime);
            const endTime = new Date(data.end.dateTime);
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return {
                start: startTime.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                }),
                end: endTime.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                }),
                name: data.summary,
                day: startTime.getDate(),
                month: months[startTime.getMonth()],
                dayOfWeek: daysOfWeek[startTime.getDay()],
                startTimeStamp: startTime.valueOf(),
                endTimeStamp: endTime.valueOf()
            }
        });
        const eventList = document.getElementById('schedule-list');
        let currentDay = null;
        events.forEach((event) => {
            if (currentDay !== event.day) {
                currentDay = event.day;
                // Generate day header
                const dayHeader = document.createElement('h3');
                dayHeader.className = "schedule-list-header";
                const endingNum = parseInt(event.day.toString()[event.day.toString().split("").length - 1]);
                dayHeader.innerHTML = `${event.month} ${event.day}${([1, 4, 5, 6, 7, 8, 9, 0].includes(endingNum)) ? "th" : (2 == endingNum) ? "nd" : "rd"}, ${event.dayOfWeek}`;
                eventList.appendChild(dayHeader);
            }
            const item = document.createElement('li');
            item.className = "schedule-list-item";
            eventList.appendChild(item);
            const itemHeader = document.createElement('p');
            itemHeader.className = "schedule-list-item-header";
            itemHeader.innerHTML = event.name;
            item.appendChild(itemHeader);
            const itemTime = document.createElement('p');
            itemTime.className = "schedule-list-item-time";
            itemTime.innerHTML = `${event.start} >> ${event.end}`;
            item.appendChild(itemTime);
            const nowTime = new Date().valueOf();
            if (nowTime > event.startTimeStamp) {
                const overlay = document.createElement('div');
                overlay.className = "schedule-list-item-overlay";
                const startEndDiff = event.endTimeStamp - event.startTimeStamp;
                const timeSinceStart = nowTime - event.startTimeStamp;
                const percent = timeSinceStart / startEndDiff * 100;
                overlay.style.height = `${percent}%`;
                item.appendChild(overlay);
            }
        });
    }
    // Create faq
    const faqList = document.getElementById('faq-list');
    let index = 0;
    faqQuestions.forEach((faq) => {
        const item = document.createElement('li');
        item.className = "faq-list-item";
        item.id = `faq-list-item-${index}`;
        faqList.appendChild(item);
        const faqText = document.createElement('p');
        faqText.className = "faq-list-item-text";
        faqText.innerHTML = `<span class=\"faq-list-item-text-question\">${faq.question}</span>`;
        item.appendChild(faqText);
        const arrow = document.createElement('img');
        arrow.className = "faq-list-item-arrow";
        arrow.src = "/Media/chevron-down-solid.svg";
        arrow.alt = "See more info";
        item.appendChild(arrow);
        // Listen for click
        let faqOpen = false;
        let faqLock = false;
        item.addEventListener('click', () => {
            if (!faqLock) {
                if (faqOpen) {
                    arrow.style.transform = "rotate(0deg)";
                    faqLock = true;
                    faqText.innerHTML = `<span class=\"faq-list-item-text-question\">${faq.question}</span>`;
                    faqOpen = false;
                    faqLock = false;
                } else {
                    arrow.style.transform = "rotate(180deg)";
                    faqLock = true;
                    const answerSplit = faq.answer.split("");
                    faqText.innerHTML += "<br><br>";
                    for (let i = 0; i < answerSplit.length; i++) {
                        setTimeout(() => {
                            faqText.innerHTML += answerSplit[i];
                            if (i === answerSplit.length - 1) {
                                faqLock = false;
                            }
                        }, 5 * i);
                    }
                    faqOpen = true;
                }
            }
        })
        index++;
    })
    // background stuff
    var canvas = document.querySelector(".hacker-3d-shiz"),
        ctx = canvas.getContext("2d"),
        canvasBars = document.querySelector(".bars-and-stuff"),
        ctxBars = canvasBars.getContext("2d"),
        outputConsole = document.querySelector(".output-console");

    canvas.width = (window.innerWidth / 3) * 2;
    canvas.height = window.innerHeight / 3;

    canvasBars.width = window.innerWidth / 3;
    canvasBars.height = canvas.height;

    outputConsole.style.height = (window.innerHeight / 3) * 2 + 'px';
    outputConsole.style.top = window.innerHeight / 3 + 'px'


    /* Graphics stuff */
    function Square(z) {
        this.width = canvas.width / 2;

        if (canvas.height < 200) {
            this.width = 200;
        };

        this.height = canvas.height;
        z = z || 0;

        this.points = [
            new Point({
                x: (canvas.width / 2) - this.width,
                y: (canvas.height / 2) - this.height,
                z: z
            }),
            new Point({
                x: (canvas.width / 2) + this.width,
                y: (canvas.height / 2) - this.height,
                z: z
            }),
            new Point({
                x: (canvas.width / 2) + this.width,
                y: (canvas.height / 2) + this.height,
                z: z
            }),
            new Point({
                x: (canvas.width / 2) - this.width,
                y: (canvas.height / 2) + this.height,
                z: z
            })];
        this.dist = 0;
    }

    Square.prototype.update = function () {
        for (var p = 0; p < this.points.length; p++) {
            this.points[p].rotateZ(0.001);
            this.points[p].z -= 3;
            if (this.points[p].z < -300) {
                this.points[p].z = 2700;
            }
            this.points[p].map2D();
        }
    }

    Square.prototype.render = function () {
        ctx.beginPath();
        ctx.moveTo(this.points[0].xPos, this.points[0].yPos);
        for (var p = 1; p < this.points.length; p++) {
            if (this.points[p].z > -(focal - 50)) {
                ctx.lineTo(this.points[p].xPos, this.points[p].yPos);
            }
        }

        ctx.closePath();
        ctx.stroke();

        this.dist = this.points[this.points.length - 1].z;

    };

    function Point(pos) {
        this.x = pos.x - canvas.width / 2 || 0;
        this.y = pos.y - canvas.height / 2 || 0;
        this.z = pos.z || 0;

        this.cX = 0;
        this.cY = 0;
        this.cZ = 0;

        this.xPos = 0;
        this.yPos = 0;
        this.map2D();
    }

    Point.prototype.rotateZ = function (angleZ) {
        var cosZ = Math.cos(angleZ),
            sinZ = Math.sin(angleZ),
            x1 = this.x * cosZ - this.y * sinZ,
            y1 = this.y * cosZ + this.x * sinZ;

        this.x = x1;
        this.y = y1;
    }

    Point.prototype.map2D = function () {
        var scaleX = focal / (focal + this.z + this.cZ),
            scaleY = focal / (focal + this.z + this.cZ);

        this.xPos = vpx + (this.cX + this.x) * scaleX;
        this.yPos = vpy + (this.cY + this.y) * scaleY;
    };

    // Init graphics stuff
    var squares = [],
        focal = canvas.width / 2,
        vpx = canvas.width / 2,
        vpy = canvas.height / 2,
        barVals = [],
        sineVal = 0;

    /* fake console stuff */
    var commandStart = ['Performing DNS Lookups for',
        'Searching ',
        'Analyzing ',
        'Estimating Approximate Location of ',
        'Compressing ',
        'Requesting Authorization From : ',
        'wget -a -t ',
        'tar -xzf ',
        'Entering Location ',
        'Compilation Started of ',
        'Downloading '],
        commandParts = ['Data Structure',
            'http://wwjd.com?au&2',
            'Texture',
            'TPS Reports',
            ' .... Searching ... ',
            'http://zanb.se/?23&88&far=2',
            'http://ab.ret45-33/?timing=1ww'],
        commandResponses = ['Authorizing ',
            'Authorized...',
            'Access Granted..',
            'Going Deeper....',
            'Compression Complete.',
            'Compilation of Data Structures Complete..',
            'Entering Security Console...',
            'Encryption Unsuccesful Attempting Retry...',
            'Waiting for response...',
            '....Searching...',
            'Calculating Space Requirements '
        ],
        isProcessing = false,
        processTime = 0,
        lastProcess = 0;


    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        squares.sort(function (a, b) {
            return b.dist - a.dist;
        });
        for (var i = 0, len = squares.length; i < len; i++) {
            squares[i].update();
            squares[i].render();
        }

        ctxBars.clearRect(0, 0, canvasBars.width, canvasBars.height);

        ctxBars.beginPath();
        var y = canvasBars.height / 6;
        ctxBars.moveTo(0, y);

        for (i = 0; i < canvasBars.width; i++) {
            var ran = (Math.random() * 20) - 10;
            if (Math.random() > 0.98) {
                ran = (Math.random() * 50) - 25
            }
            ctxBars.lineTo(i, y + ran);
        }

        ctxBars.stroke();

        for (i = 0; i < canvasBars.width; i += 20) {
            if (!barVals[i]) {
                barVals[i] = {
                    val: Math.random() * (canvasBars.height / 2),
                    freq: 0.1,
                    sineVal: Math.random() * 100
                };
            }

            barVals[i].sineVal += barVals[i].freq;
            barVals[i].val += Math.sin(barVals[i].sineVal * Math.PI / 2) * 5;
            ctxBars.fillRect(i + 5, canvasBars.height, 15, -barVals[i].val);
        }

        requestAnimationFrame(render);
    }

    function consoleOutput() {
        var textEl = document.createElement('p');

        if (isProcessing) {
            textEl = document.createElement('span');
            textEl.textContent += Math.random() + " ";
            if (Date.now() > lastProcess + processTime) {
                isProcessing = false;
            }
        } else {
            var commandType = ~~(Math.random() * 4);
            switch (commandType) {
                case 0:
                    textEl.textContent = commandStart[~~(Math.random() * commandStart.length)] + commandParts[~~(Math.random() * commandParts.length)];
                    break;
                case 3:
                    isProcessing = true;
                    processTime = ~~(Math.random() * 5000);
                    lastProcess = Date.now();
                default:
                    textEl.textContent = commandResponses[~~(Math.random() * commandResponses.length)];
                    break;
            }
        }

        outputConsole.scrollTop = outputConsole.scrollHeight;
        outputConsole.appendChild(textEl);

        if (outputConsole.scrollHeight > window.innerHeight) {
            var removeNodes = outputConsole.querySelectorAll('*');
            for (var n = 0; n < ~~(removeNodes.length / 3); n++) {
                outputConsole.removeChild(removeNodes[n]);
            }
        }

        setTimeout(consoleOutput, ~~(Math.random() * 200));
    }

    setTimeout(function () {
        canvas.width = (window.innerWidth / 3) * 2;
        canvas.height = window.innerHeight / 3;

        canvasBars.width = window.innerWidth / 3;
        canvasBars.height = canvas.height;

        outputConsole.style.height = (window.innerHeight / 3) * 2 + 'px';
        outputConsole.style.top = window.innerHeight / 3 + 'px';

        focal = canvas.width / 2;
        vpx = canvas.width / 2;
        vpy = canvas.height / 2;

        for (var i = 0; i < 15; i++) {
            squares.push(new Square(-300 + (i * 200)));
        }

        ctx.strokeStyle = ctxBars.strokeStyle = ctxBars.fillStyle = '#00FF00';

        render();
        consoleOutput();
    }, 200);

    window.addEventListener('resize', function () {
        canvas.width = (window.innerWidth / 3) * 2;
        canvas.height = window.innerHeight / 3;

        canvasBars.width = window.innerWidth / 3;
        canvasBars.height = canvas.height;

        outputConsole.style.height = (window.innerHeight / 3) * 2 + 'px';
        outputConsole.style.top = window.innerHeight / 3 + 'px';

        focal = canvas.width / 2;
        vpx = canvas.width / 2;
        vpy = canvas.height / 2;
        ctx.strokeStyle = ctxBars.strokeStyle = ctxBars.fillStyle = '#00FF00';
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
    if (commandString.toLowerCase() == "ssh admin") {
        window.location.pathname = "/adminLogin.html";
        return;
    }
    if (!validCommands.find(c => c.name == command) && !["TicTacToe.out", "Connect4.out", "MatchMemory.out"].concat(Object.keys(validDirs["home"]["IlIlIlIl"]).filter((d) => !["name", "type"].includes(d)).map((v, i) => v + ".out")).includes(command) && inGame === false) {
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
    } else if ((["TicTacToe.out", "Connect4.out", "MatchMemory.out"].concat(Object.keys(validDirs["home"]["IlIlIlIl"]).filter((d) => !["name", "type"].includes(d)).map((v, i) => v + ".out"))).includes(command) || inGame === true) {
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
                if (inGame === true) {
                    toConsole(`It is currently ${controller.currentTurn.name}\'s turn. You can quit by using exit`, true);
                    input.value = "";
                    return false;
                }
                controller = new MatchMemory("Player1", "Player2");
                toConsole(commandString, false);
                output.innerHTML += `<br><span class="terminalTitle">MatchMemory</span><br>${controller.printBoard()}`;
                inGame = true;
                currentGame = "MatchMemory";
                // Explain rules
                output.innerHTML += `<br>The rules are simple match two cards together and take those cards, the player with the most cards at the end wins. If a player gets more than half of the cards they automatically win. When it is your turn enter a number (1-24) corresponding to a spot on the board.<br><br> ${controller.currentTurn.name}\'s turn:`;
                scrollToBottom();
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
            } else if (currentGame === "MatchMemory") {
                const num = parseInt(commandString) - 1;
                if (num > 23 || num < 0) {
                    toConsole(`Invalid input.`, true);
                    input.value = "";
                    return false;
                }
                const col = num % 6;
                const row = Math.floor(num / 6);
                // Check if spot taken already
                if (controller.publicBoard[row][col] === "⬛⬛") {
                    toConsole(`There is no card in that spot.`, true);
                    input.value = "";
                    return false;
                }
                const oldTurnPlayer = controller.checkCard(row, col, controller.currentTurn);
                output.innerHTML = `
                    Welcome to eHacks 2025!
                    <br>
                    Here you can view info, register, manage your registration, and more.
                    <br>
                    There could be some interesting things to find within this page.
                    <br>
                `;
                output.innerHTML += `<br><span class="terminalTitle">MatchMemory</span><br>${controller.printBoard()}`;
                if (controller.checkForWin(oldTurnPlayer)) {
                    output.innerHTML += `${oldTurnPlayer.name} has won!`;
                    inGame = false;
                    currentGame = "";
                    controller = null;
                    scrollToBottom();
                    input.value = "";
                    return;
                }
                // if (controller.turnCount === 9) {
                //     output.innerHTML += `It ended in a tie!`;
                //     inGame = false;
                //     currentGame = "";
                //     controller = null;
                //     scrollToBottom();
                //     input.value = "";
                //     return;
                // }
                output.innerHTML += `${controller.currentTurn.name}\'s turn:`;
                scrollToBottom();
            }
        } else {
            // /home/IlIlIlIl
            const targetDir = validDirs["home"]["IlIlIlIl"][command.split(".")[0]];
            if (!targetDir) {
                toConsole("Invalid command", true);
                input.value = "";
                return false;
            }
            if (targetDir.winner) {
                output.innerHTML += `<br>Your easter egg code: ${getSecretCode(1)}<br>You got 60s to enter this code into the redemption box before it resets!`;
                input.value = "";
            } else {
                output.innerHTML += `<br>Better luck next time :p`;
                input.value = "";
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

class MatchMemory {
    player1 = {
        score: 0,
        name: ""
    };
    player2 = {
        score: 0,
        name: ""
    };
    cardHeld = null;
    placeHolder = null;
    possibleCards = ["✨", "✨", "🎈", "🎈", "🎉", "🎉", "🎃", "🎃", "🎭", "🎭", "🛒", "🛒", "🦺", "🦺", "✈️", "✈️", "🛸", "🛸", "🍑", "🍑", "🍆", "🍆", "⚛️", "⚛️"]
    publicBoard = [
        ["0️⃣1️⃣", "0️⃣2️⃣", "0️⃣3️⃣", "0️⃣4️⃣", "0️⃣5️⃣", "0️⃣6️⃣"],
        ["0️⃣7️⃣", "0️⃣8️⃣", "0️⃣9️⃣", "1️⃣0️⃣", "1️⃣1️⃣", "1️⃣2️⃣"],
        ["1️⃣3️⃣", "1️⃣4️⃣", "1️⃣5️⃣", "1️⃣6️⃣", "1️⃣7️⃣", "1️⃣8️⃣"],
        ["1️⃣9️⃣", "2️⃣0️⃣", "2️⃣1️⃣", "2️⃣2️⃣", "2️⃣3️⃣", "2️⃣4️⃣"]
    ];
    hiddenBoard = [
        ["⬛⬛", "⬛⬛", "⬛⬛", "⬛⬛", "⬛⬛", "⬛⬛"],
        ["⬛⬛", "⬛⬛", "⬛⬛", "⬛⬛", "⬛⬛", "⬛⬛"],
        ["⬛⬛", "⬛⬛", "⬛⬛", "⬛⬛", "⬛⬛", "⬛⬛"],
        ["⬛⬛", "⬛⬛", "⬛⬛", "⬛⬛", "⬛⬛", "⬛⬛"],
    ];
    currentTurn = this.player1;
    constructor(player1Name, player2Name) {
        this.possibleCards = ["✨", "✨", "🎈", "🎈", "🎉", "🎉", "🎃", "🎃", "🎭", "🎭", "🛒", "🛒", "🦺", "🦺", "✈️", "✈️", "🛸", "🛸", "🍑", "🍑", "🍆", "🍆", "⚛️", "⚛️"]
        this.player1.name = player1Name;
        this.player2.name = player2Name;
        for (let row = 0; row < this.hiddenBoard.length; row++) {
            for (let col = 0; col < this.hiddenBoard[row].length; col++) {
                let randomNum = getRandomInt(0, this.possibleCards.length - 1);
                this.hiddenBoard[row][col] = this.possibleCards[randomNum] + this.possibleCards[randomNum];
                this.possibleCards.splice(randomNum, 1);
            }
        }
    }

    printBoard() {
        let text = "<br>";
        text += `┃${this.publicBoard.map((v, i) => v.join("┃")).join("┃<br><br>┃")}┃<br><br>${controller.player1.name}: ${controller.player1.score}&nbsp;&nbsp;&nbsp;${controller.player2.name}: ${controller.player2.score}<br>`;
        // text += `┃${this.hiddenBoard.map((v, i) => v.join("┃")).join("┃<br>┃")}┃<br><br>`;
        return text;
    }

    checkCard(row, column, player) {
        // Check if card is held
        if (this.cardHeld !== null) {
            // Compare card held to other card
            if (this.cardHeld.name === this.hiddenBoard[row][column]) {
                // Remove held card
                this.hiddenBoard[this.cardHeld.row][this.cardHeld.column] = "⬛⬛";
                // Remove second card
                this.hiddenBoard[row][column] = "⬛⬛";
                // Remove public cards
                this.publicBoard[this.cardHeld.row][this.cardHeld.column] = "⬛⬛";
                this.publicBoard[row][column] = "⬛⬛";
                // Increase player score by 2
                player.score += 2;
                this.cardHeld = null
            } else {
                // Hide card and remove card held
                this.publicBoard[this.cardHeld.row][this.cardHeld.column] = this.placeHolder;
                this.placeHolder = null;
                this.cardHeld = null;
            }
            this.currentTurn = (player == this.player1) ? this.player2 : this.player1;
        } else {
            // Store card in hand
            this.cardHeld = {
                name: this.hiddenBoard[row][column],
                column: column,
                row: row
            };
            // Show card in public board
            this.placeHolder = this.publicBoard[row][column];
            this.publicBoard[row][column] = `${this.hiddenBoard[row][column]}`;
        }
        return player;
    }

    checkForWin(player) {
        return player.score > 12 && (player === this.player1) ? player.score > this.player2.score : player.score > this.player1.score;
    }
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function deleteAllCookies() {
    document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
}

function getSecretCode(id) {
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += getRandomInt(0, 9);
    }
    secretCode = code;
    eeId = id;
    setTimeout(() => {
        // Reset code
        secretCode = null;
        eeId = null;
        alert("Your code has expired!");
    }, 60_000);
    return code;
}

function randomizeText(element, delay = 50, duration = 2000) {
    const originalText = element.dataset.text;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let interval, timeout;
    let currentText = originalText.split('').map(() => " ").join('');

    function scramble() {
        currentText = currentText.split('').map((char, i) =>
            Math.random() > 0.3 ? characters[Math.floor(Math.random() * characters.length)] : originalText[i]
        ).join('');
        element.textContent = currentText;
    }

    interval = setInterval(scramble, delay);

    timeout = setTimeout(() => {
        clearInterval(interval);
        element.textContent = originalText;
    }, duration);
}

