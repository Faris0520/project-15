// Select required DOM elements
const papanPermainan = document.querySelector(".play-board");
const elemenSkor = document.querySelector(".score"); 
const elemenSkorTertinggi = document.querySelector(".high-score");
const kontrolPermainan = document.querySelectorAll(".controls i");

// Initialize game variables
let permainanBerakhir = false;
let makananX, makananY;
let ularX = 5, ularY = 5;
let kecepatanX = 0, kecepatanY = 0;
let tubuhUlar = [];
let intervalId;
let skor = 0;

// Get high score from local storage
let skorTertinggi = localStorage.getItem("high-score") || 0;
elemenSkorTertinggi.innerText = `High Score: ${skorTertinggi}`;

// Generate random food position between 1 and 30
const perbaruiPosisiMakanan = () => {
    makananX = Math.floor(Math.random() * 30) + 1;
    makananY = Math.floor(Math.random() * 30) + 1;
}

// Handle game over
const tanganiGameOver = () => {
    clearInterval(intervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

// Change direction based on key press
const ubahArah = e => {
    if (e.key === "ArrowUp" && kecepatanY != 1) {
        kecepatanX = 0;
        kecepatanY = -1;
    } else if (e.key === "ArrowDown" && kecepatanY != -1) {
        kecepatanX = 0;
        kecepatanY = 1;
    } else if (e.key === "ArrowLeft" && kecepatanX != 1) {
        kecepatanX = -1;
        kecepatanY = 0;
    } else if (e.key === "ArrowRight" && kecepatanX != -1) {
        kecepatanX = 1;
        kecepatanY = 0;
    }
}

// Change direction on control buttons click
kontrolPermainan.forEach(tombol => tombol.addEventListener("click", () => ubahArah({ key: tombol.dataset.key })));

// Main game function
const mulaiPermainan = () => {
    if (permainanBerakhir) return tanganiGameOver();
    let html = `<div class="food" style="grid-area: ${makananY} / ${makananX}"></div>`;

    // When snake eats food
    if (ularX === makananX && ularY === makananY) {
        perbaruiPosisiMakanan();
        tubuhUlar.push([makananY, makananX]); 
        skor++;
        skorTertinggi = skor >= skorTertinggi ? skor : skorTertinggi;

        localStorage.setItem("high-score", skorTertinggi);
        elemenSkor.innerText = `Score: ${skor}`;
        elemenSkorTertinggi.innerText = `High Score: ${skorTertinggi}`;
    }

    // Update snake head position
    ularX += kecepatanX;
    ularY += kecepatanY;

    // Shift snake body elements
    for (let i = tubuhUlar.length - 1; i > 0; i--) {
        tubuhUlar[i] = tubuhUlar[i - 1];
    }

    tubuhUlar[0] = [ularX, ularY];

    // Check wall collision
    if (ularX <= 0 || ularX > 30 || ularY <= 0 || ularY > 30) {
        return permainanBerakhir = true;
    }

    // Add div for each snake body part
    for (let i = 0; i < tubuhUlar.length; i++) {
        html += `<div class="head" style="grid-area: ${tubuhUlar[i][1]} / ${tubuhUlar[i][0]}"></div>`;
        // Check head collision with body
        if (i !== 0 && tubuhUlar[0][1] === tubuhUlar[i][1] && tubuhUlar[0][0] === tubuhUlar[i][0]) {
            permainanBerakhir = true;
        }
    }
    papanPermainan.innerHTML = html;
}

// Start game
perbaruiPosisiMakanan();
intervalId = setInterval(mulaiPermainan, 100);
document.addEventListener("keyup", ubahArah);