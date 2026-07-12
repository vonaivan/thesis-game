/* ==========================================
   Treasure Trails v2
   FINAL SCRIPT
   Part 1A.1
========================================== */

// ===============================
// GAME SETTINGS
// ===============================

const TILE_SIZE = 48;
const ROWS = 10;
const COLS = 10;
const TOTAL_COINS = 10;

// ===============================
// PLAYER
// ===============================

const player = {
    row: 1,
    col: 1,
    coins: 0,
    premium: false,
    speed: 1
};

// ===============================
// GAME STATE
// ===============================

let participantID = "";
let group = "";

let trialUsed = false;
let trialActive = false;
let trialSeconds = 30;

let gameStarted = false;
let elapsedSeconds = 0;

let timerInterval = null;
let trialInterval = null;

// ===============================
// HTML ELEMENTS
// ===============================

const gameBoard = document.getElementById("gameBoard");

const menu = document.getElementById("menu");

const gameUI = document.getElementById("gameUI");

const coinLabel = document.getElementById("coinCount");

const timerLabel = document.getElementById("time");

const survey = document.getElementById("survey");

const trialPopup = document.getElementById("trialPopup");

const trialEndedPopup = document.getElementById("trialEnded");

// ===============================
// MAP LEGEND
// G = Grass
// T = Tree
// C = Coin
// W = Water
// F = Flower
// R = Rock
// ===============================

const originalMap = [

["T","T","T","T","T","T","T","T","T","T"],

["T","G","C","G","F","G","C","F","G","T"],

["T","G","T","G","G","G","T","G","C","T"],

["T","F","G","C","W","G","G","G","G","T"],

["T","C","G","R","G","C","T","G","F","T"],

["T","G","G","T","G","G","G","C","G","T"],

["T","G","C","G","F","T","G","G","G","T"],

["T","G","G","G","G","G","W","C","G","T"],

["T","F","G","C","G","G","G","X","C","T"],

["T","T","T","T","T","T","T","T","T","T"]

];

let map = [];

// ===============================
// TILE CREATION
// ===============================

function createTile(type){

    const tile = document.createElement("div");

    tile.classList.add("tile");

    switch(type){

        case "G":

            tile.classList.add("grass");

            break;

        case "T":

            tile.classList.add("tree");

            break;

	case "X":

    	    tile.classList.add("chest");

            tile.innerHTML = "📦";

    	break;

        case "C":

    tile.classList.add("coin");

    tile.innerHTML = "🪙";

    break;

        case "W":

            tile.classList.add("water");

            break;

        case "F":

            tile.classList.add("flower");

            break;

        case "R":

            tile.classList.add("rock");

            break;

    }

    return tile;

}

// ===============================
// DRAW MAP
// ===============================

function drawMap(){

    gameBoard.innerHTML = "";

    gameBoard.style.gridTemplateColumns =
        `repeat(${COLS}, ${TILE_SIZE}px)`;

    for(let r=0; r<ROWS; r++){

        for(let c=0; c<COLS; c++){

            const tile = createTile(map[r][c]);

            if(r===player.row && c===player.col){

                tile.innerHTML = player.premium
    		? "🤠"
    		: "😀";

            }

            gameBoard.appendChild(tile);

        }

    }

}

// ===============================
// GAME TIMER
// ===============================

function startGameTimer(){

    clearInterval(timerInterval);

    elapsedSeconds = 0;

    timerInterval = setInterval(()=>{

        elapsedSeconds++;

        timerLabel.textContent = elapsedSeconds;

    },1000);

}

console.log("Treasure Trails Final - Part 1A.1 Loaded");

// ===============================
// COLLISION
// ===============================

function isWalkable(row, col){

    if(row < 0 || row >= ROWS) return false;

    if(col < 0 || col >= COLS) return false;

    const tile = map[row][col];

    if(tile === "T") return false;

    if(tile === "W") return false;

    if(tile === "R") return false;

    return true;

}

// ===============================
// COIN COLLECTION
// ===============================

function collectCoin(){

    if(map[player.row][player.col] !== "C"){

        return;

    }

    map[player.row][player.col] = "G";

    player.coins++;

    coinLabel.textContent = player.coins;

    drawMap();

    checkWin();

}

// ===============================
// PLAYER MOVEMENT
// ===============================

function movePlayer(dr, dc){

    if(!gameStarted){

        gameStarted = true;

        startGameTimer();

    }

    for(let i = 0; i < player.speed; i++){

        const newRow = player.row + dr;

        const newCol = player.col + dc;

        if(!isWalkable(newRow, newCol)){

            break;

        }

        player.row = newRow;

        player.col = newCol;

        collectCoin();
	if(
    	player.coins === TOTAL_COINS &&
     map[player.row][player.col] === "X"
){

    finishGame();

}

    }

    drawMap();

}

// ===============================
// KEYBOARD CONTROLS
// ===============================

document.addEventListener("keydown", function(event){

    switch(event.key){

        case "ArrowUp":

        case "w":

        case "W":

            movePlayer(-1,0);

            break;

        case "ArrowDown":

        case "s":

        case "S":

            movePlayer(1,0);

            break;

        case "ArrowLeft":

        case "a":

        case "A":

            movePlayer(0,-1);

            break;

        case "ArrowRight":

        case "d":

        case "D":

            movePlayer(0,1);

            break;

    }

});

// ===============================
// WIN CONDITION
// ===============================

function checkWin(){

    if(player.coins < TOTAL_COINS){

        return;

    }

    if(group === "Control"){

        finishControlGame();

    }

    else if(group === "Experimental"){

        finishExperimentalGame();

    }

}

function finishControlGame(){

    survey.querySelector("h2").textContent =
        "Purchase Intention Survey";

    survey.querySelector("p").textContent =
        "You played the standard version of Treasure Trails. Would you purchase the Premium Map for ₱99?";

    survey.style.display = "flex";

}

// ===============================
// GAME START
// ===============================

function initializeGame(){
    
    map = JSON.parse(JSON.stringify(originalMap));

    player.row = 1;

    player.col = 1;

    player.coins = 0;

    player.speed = 1;

    player.premium = false;

    trialUsed = false;

    trialActive = false;

    trialSeconds = 30;

    gameStarted = false;

    elapsedSeconds = 0;

    coinLabel.textContent = "0";

    timerLabel.textContent = "0 sec";

    drawMap();

}

initializeGame();

console.log("Treasure Trails Final - Part 1A.2 Loaded");

// ===============================
// GROUP SELECTION
// ===============================

function startControlGroup(id){

    participantID = id;

    group = "Control";

    menu.style.display = "none";

    gameUI.style.display = "block";

    initializeGame();

}

function startExperimentalGroup(id){

    participantID = id;

    group = "Experimental";

    menu.style.display = "none";

    gameUI.style.display = "block";

    initializeGame();

    setTimeout(function(){

        trialPopup.style.display = "flex";

    },500);

}

// ===============================
// START BUTTON
// ===============================

document.getElementById("startBtn").addEventListener("click", function(){

    const idInput = document.getElementById("participant");

    const groupInput = document.getElementById("group");

    if(idInput.value.trim() === ""){

        alert("Please enter Participant ID.");

        return;

    }

    if(groupInput.value === ""){

        alert("Please choose a group.");

        return;

    }

    if(groupInput.value === "control"){

    startControlGroup(idInput.value);

}else if(groupInput.value === "experimental"){

    startExperimentalGroup(idInput.value);

}

});

// ===============================
// PREMIUM TRIAL
// ===============================

document.getElementById("useTrial").addEventListener("click",function(){

    trialPopup.style.display="none";

    startPremiumTrial();

});

document.getElementById("skipTrial").addEventListener("click",function(){

    trialPopup.style.display="none";

});

// ===============================
// START PREMIUM
// ===============================

function startPremiumTrial(){
    
    document.getElementById("premiumStatus").textContent =
    "⭐ Premium Trial Active";

    trialUsed = true;

    trialActive = true;

    player.premium = true;

    gameBoard.classList.add("premium");

    player.speed = 2;

    trialSeconds = 30;

    timerLabel.textContent =
        "⭐ Trial: " + trialSeconds + " sec";

    drawMap();

    clearInterval(trialInterval);

    trialInterval = setInterval(function(){

        trialSeconds--;

        timerLabel.textContent =
            "⭐ Trial: " + trialSeconds + " sec";

        if(trialSeconds <= 0){

            endPremiumTrial();

        }

    },1000);

}

// ===============================
// END PREMIUM
// ===============================

function endPremiumTrial(){

    document.getElementById("premiumStatus").textContent =
    "Standard Version";

    clearInterval(trialInterval);

    trialActive = false;

    player.premium = false;

    gameBoard.classList.remove("premium");

    player.speed = 1;

    timerLabel.textContent = elapsedSeconds;

    trialEndedPopup.style.display = "flex";

    drawMap();

}

// ===============================
// CONTINUE BUTTON
// ===============================

document.getElementById("continueBtn").addEventListener("click",function(){

    trialEndedPopup.style.display = "none";

});

// ===============================
// GAME COMPLETE
// ===============================

function finishControlGame(){

    clearInterval(timerInterval);

    gameStarted = false;

    survey.querySelector("h2").textContent =
        "Purchase Intention Survey";

    survey.querySelector("p").textContent =
        "After playing the standard version, would you purchase the Premium Explorer Pass for ₱99?";

    survey.style.display = "flex";

}

function finishExperimentalGame(){

    clearInterval(timerInterval);

    clearInterval(trialInterval);

    gameStarted = false;

    survey.querySelector("h2").textContent =
        "Purchase Intention Survey";

    survey.querySelector("p").textContent =
        "After experiencing the Premium Trial, would you purchase the Premium Explorer Pass for ₱99?";

    survey.style.display = "flex";

}


console.log("Treasure Trails Final - Part 2 Loaded");

// ===============================
// SURVEY BUTTONS
// ===============================

document.querySelectorAll("#survey button").forEach(button=>{

    button.addEventListener("click",function(){

        const answer = this.dataset.answer;

        exportCSV(answer);

    });

});

// ===============================
// CSV EXPORT
// ===============================

function exportCSV(answer){

    const headers = [

        "Participant ID",
        "Group",
        "Coins Collected",
        "Completion Time",
        "Premium Trial Used",
        "Purchase Intention"

    ];

    const values = [

    participantID,

    group,

    player.coins,

    elapsedSeconds,

    group === "Experimental"
        ? (trialUsed ? "Yes" : "No")
        : "N/A",

    answer

];

    let csv = headers.join(",") + "\n";

    csv += values.join(",");

    const blob = new Blob([csv],{

        type:"text/csv"

    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
        participantID + "_result.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    alert("Thank you for participating!");

    restartGame();

}

// ===============================
// RESTART GAME
// ===============================

function restartGame(){

    clearInterval(timerInterval);

    clearInterval(trialInterval);

    player.row = 1;

    player.col = 1;

    player.coins = 0;

    player.speed = 1;

    player.premium = false;

    trialUsed = false;

    trialActive = false;

    trialSeconds = 30;

    elapsedSeconds = 0;

    gameStarted = false;

    coinLabel.textContent = "0";

    timerLabel.textContent = "0 sec";

    survey.style.display = "none";

    trialPopup.style.display = "none";

    trialEndedPopup.style.display = "none";

    menu.style.display = "flex";

    gameUI.style.display = "none";

    initializeGame();

}

// ===============================
// OPTIONAL RESET BUTTON
// ===============================

const resetButton = document.getElementById("resetBtn");

if(resetButton){

    resetButton.addEventListener("click",restartGame);

}

// ===============================
// PREVENT SCROLLING
// ===============================

window.addEventListener("keydown",function(e){

    if(

        e.key==="ArrowUp" ||

        e.key==="ArrowDown" ||

        e.key==="ArrowLeft" ||

        e.key==="ArrowRight"

    ){

        e.preventDefault();

    }

});

// ===============================
// GAME READY
// ===============================

console.log("================================");

console.log("Treasure Trails Ready");

console.log("Version 1.0");

console.log("Research Instrument Loaded");

console.log("================================");