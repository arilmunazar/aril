const CONFIG = {
    pin: "0705",
    startDate: "2026-05-07T00:00:00",
    musicFile: "assets/music.mp3"
};

const lockScreen = document.getElementById("lockScreen");
const site = document.getElementById("site");
const pinDisplay = document.getElementById("pinDisplay");
const pinDots = document.querySelectorAll("#pinDots span");
const pinMessage = document.getElementById("pinMessage");

let enteredPin = "";
let reasonIndex = 0;

const reasons = [
    "Karenaa senyum kamu selaluu bikin suasana jadi lebih baikk.",
    "Karena kamuu punya cara sendiri untuk bikinn hari terasa spesial.",
    "Karenaa setiap momen sederhana barengg kamuu tetap terasa berartii.",
    "Karena kamuu adalah salah satuu orang yang selaluu akuu hargai.",
    "Karenaa kehadiran kamuu punya arti yang nggak bisaa dijelasinn dengan kata-kata.",
    "Pokonyaa akuu bersyukur bangett bisaa kenal sama kamuu."
];

/* ---------- PIN ---------- */
document.querySelectorAll(".keypad button[data-key]").forEach(button => {
    button.addEventListener("click", () => {
        if (enteredPin.length >= 4) return;

        enteredPin += button.dataset.key;
        updatePinUI();

        if (enteredPin.length === 4) {
            setTimeout(checkPin, 180);
        }
    });
});

document.querySelector('[data-action="backspace"]').addEventListener("click", () => {
    enteredPin = enteredPin.slice(0, -1);
    pinMessage.textContent = "Kode demo: 2903";
    pinMessage.classList.remove("error");
    updatePinUI();
});

document.addEventListener("keydown", event => {
    if (lockScreen.classList.contains("hidden")) return;

    if (/^\d$/.test(event.key)) {
        document.querySelector(`[data-key="${event.key}"]`)?.click();
    }

    if (event.key === "Backspace") {
        document.querySelector('[data-action="backspace"]')?.click();
    }
});

function updatePinUI() {
    pinDisplay.textContent = "•".repeat(enteredPin.length) + "·".repeat(4 - enteredPin.length);

    pinDots.forEach((dot, index) => {
        dot.classList.toggle("filled", index < enteredPin.length);
    });
}

function checkPin() {
    if (enteredPin === CONFIG.pin) {
        unlockSite();
    } else {
        pinMessage.textContent = "Kode salah. Coba lagi.";
        pinMessage.classList.add("error");

        lockScreen.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-8px)" },
                { transform: "translateX(8px)" },
                { transform: "translateX(0)" }
            ],
            { duration: 260 }
        );

        enteredPin = "";
        updatePinUI();
    }
}

function unlockSite() {
    lockScreen.classList.add("hidden");
    site.classList.remove("hidden");
    document.body.classList.remove("locked");

    createPetals(18);
    setupRevealObserver();
    updateCounter();
}

/* ---------- PETALS ---------- */
function createPetals(amount = 12) {
    document.querySelectorAll(".petal-layer").forEach(layer => {
        for (let i = 0; i < amount; i++) {
            const petal = document.createElement("span");
            petal.className = "petal";
            petal.style.left = Math.random() * 100 + "%";
            petal.style.setProperty("--drift", `${(Math.random() - 0.5) * 180}px`);
            petal.style.animationDuration = `${5 + Math.random() * 7}s`;
            petal.style.animationDelay = `${Math.random() * 3}s`;
            petal.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.6 + Math.random() * 1.2})`;
            layer.appendChild(petal);

            setTimeout(() => petal.remove(), 16000);
        }
    });
}

setInterval(() => {
    if (!lockScreen.classList.contains("hidden")) {
        createPetals(2);
    } else {
        createPetals(1);
    }
}, 1700);

/* ---------- REVEAL ON SCROLL ---------- */
function setupRevealObserver() {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    elements.forEach(element => observer.observe(element));
}

/* ---------- BOUQUET ---------- */
document.getElementById("bloomButton").addEventListener("click", () => {
    const bouquet = document.getElementById("bouquetArt");
    bouquet.classList.toggle("bloomed");

    const button = document.getElementById("bloomButton");
    button.textContent = bouquet.classList.contains("bloomed")
        ? "Bloomed with love ♡"
        : "Make it bloom ✦";
});

/* ---------- COUNTER ---------- */
function updateCounter() {
    const start = new Date(CONFIG.startDate);
    const now = new Date();

    let diff = now - start;

    if (diff < 0) diff = 0;

    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCounter();
setInterval(updateCounter, 1000);

/* ---------- REASONS ---------- */
document.getElementById("reasonButton").addEventListener("click", () => {
    reasonIndex = (reasonIndex + 1) % reasons.length;

    const card = document.getElementById("reasonCard");
    const text = document.getElementById("reasonText");
    const label = card.querySelector("span");

    card.animate(
        [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 450 }
    );

    label.textContent = `reason #${reasonIndex + 1}`;
    text.textContent = reasons[reasonIndex];
});

/* ---------- MUSIC ---------- */
const music = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

musicButton.addEventListener("click", async () => {
    try {
        if (music.paused) {
            await music.play();
            musicButton.classList.add("playing");
            musicButton.textContent = "♫";
        } else {
            music.pause();
            musicButton.classList.remove("playing");
            musicButton.textContent = "♪";
        }
    } catch (error) {
        alert("Tambahkan file assets/music.mp3 terlebih dahulu.");
    }
});

/* ---------- INITIAL STATE ---------- */
document.body.classList.add("locked");
updatePinUI();
