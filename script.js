'use strict';

const maxColumnNumber = 3;
let elementList = [];
let score = 0;
let answeredCards = 0;
let totalCards = 0;
let highScore = 0;

async function loadGame() {
    score = 0;
    answeredCards = 0;
    totalCards = 0;
    var input = document.getElementById("card-amount-input");
    if (input.value < 1) {
        input.value = 1;
        return;
    }
    const loadingImage = document.getElementById("pregame-loading-img");
    loadingImage.removeAttribute("hidden");
    hideOrRevealElements(true);
    var result = await createCards(loadingImage, input);
    console.log(result);
}

function createCards(loadingImage, inputElement) {
    console.log("allowing for 3 second load animation before loading cards...")
    return new Promise((outputMessage) => {
        setTimeout(() => {
            loadingImage.setAttribute("hidden", true);
            generateCards(inputElement.value);
            outputMessage("Finished loading cards!");
        }, 3000);
    });
}

function generateCards(amount) {
    console.log(`generating ${amount} cards...`);
    const spawnArea = document.getElementById("card-box");
    const amountOfPokemon = pokemonData.length;
    totalCards = amount > amountOfPokemon ? amountOfPokemon : amount;
    var columns = "";
    const maxColumns = totalCards > maxColumnNumber ? maxColumnNumber : totalCards;
    for (var j = 0; j < maxColumns; j++) {
        columns += "1fr ";
    }
    spawnArea.style = `grid-template-columns: ${columns};`;
    var usedNumbers = [];
    let num;
    for (var i = 0; i < totalCards; i++) {
        do {
            num = Math.floor(Math.random() * amountOfPokemon);
        } while (usedNumbers.includes(num));
        usedNumbers.push(num);
        console.log(`Generating Card for Pokemon Number ID: ${num}`)
        spawnArea.innerHTML += `
            <div class="box-small centered-content">
                <h4 id="${num}-header">???</h4>
                <img src="${pokemonData[num]["image_src"]}"><br>
                <input id="${num}-input" type="text" placeholder="Guess...?" style="width: 55%;"><br>
                <button id="pokemon-submit-${num}">Set Answer</button>
            </div>
            `;
        elementList.push(`pokemon-submit-${num}`);
    }
    console.log(elementList);
    setupButtons();
}

function setupButtons() {
    for (var i = 0; i < elementList.length; i++) {
        console.log("adding listener for button id: " + elementList[i]);
        var btn = document.querySelector(`#${elementList[i]}`);
        console.log(btn);
        btn.addEventListener('click', submitAnswer);
    }
}

function hideOrRevealElements(hidden) {
    const hide = document.getElementsByClassName("hide-on-start");
    const show = document.getElementsByClassName("show-on-start");
    for (var i = 0; i < hide.length; i++) {
        if (hidden) hide[i].setAttribute("hidden", true);
        else hide[i].removeAttribute("hidden");
    }
    for (var i = 0; i < show.length; i++) {
        if (hidden) show[i].removeAttribute("hidden");
        else show[i].setAttribute("hidden", true);
    }
}

function submitAnswer(event) {
    var btn = event.target;
    btn.setAttribute("hidden", true);
    var id = Number(parseInt(btn.id.charAt(btn.id.length-1)));
    var input = document.getElementById(`${id}-input`);
    var answer = input.value;
    var correctLabel = pokemonData[id].label;
    var header = document.getElementById(`${id}-header`);
    input.setAttribute("disabled", true);
    header.innerText = correctLabel;
    if (answer.toUpperCase() === correctLabel.toUpperCase()) {
        header.style = "color: green;";
        score++;
    } else {
        header.style = "color: red;";
    }
    answeredCards++;
    checkGameStatus();
}

async function checkGameStatus() {
    if (answeredCards < totalCards) return;
    var result = await waitForSeconds(1.5);
    console.log(result);
    var spawnArea = document.getElementById("card-box");
    highScore = score > highScore ? score : highScore;
    spawnArea.style = "grid-template-columns: 1fr;"
    spawnArea.innerHTML = `
        <div>
            <h2>Complete!</h2>
            <p>Final Score: ${score}</p>
            <p>High Score: ${highScore}</p>
            <button onclick="playAgain()">Play Again?</button>
        </div>
    `;
}

function playAgain() {
    hideOrRevealElements(false);
    document.getElementById("card-box").innerHTML = "";
    elementList = [];
}

function waitForSeconds(seconds) {
    return new Promise((outputMessage) => {
        setTimeout(() => {
            outputMessage(`Waited for ${seconds} seconds`);
        }, seconds * 1000);
    });
}