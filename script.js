const gameBoard = document.getElementById("gameBoard");
const popup = document.getElementById("popup");
const cardImages = ["imgA.png", "imgB.png", "imgC.png", "imgD.png", "imgE.png", "imgF.png", "imgG.png", "imgH.png", "imgI.png", "imgJ.png"];
const duplicatedImages = [...cardImages, ...cardImages]; // Duplica las imágenes para el juego
const popupImages = {
    "imgA.png": "popupA.png",  // Cuando la carta 'imgA.png' se encuentra con su par, muestra 'popupA.png'
    "imgB.png": "popupB.png",  // Cuando la carta 'imgB.png' se encuentra con su par, muestra 'popupB.png'
    "imgC.png": "popupC.png",  // Y así sucesivamente...
    "imgD.png": "popupD.png",
    "imgE.png": "popupE.png",
    "imgF.png": "popupF.png",
    "imgG.png": "popupG.png",
    "imgH.png": "popupH.png",
    "imgI.png": "popupI.png",
    "imgJ.png": "popupJ.png"
};
let cards = [];
let flippedCards = [];
let matchedCards = [];
const previewTime = 3000; // Tiempo de previsualización en milisegundos (2 segundos)


// Mezcla las imágenes aleatoriamente
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function preloadPopupImages() {
    Object.values(popupImages).forEach((image) => {
        const img = new Image();
        img.src = `assets/${image}`;
        img.style.display = "none"; // Oculta las imágenes pre-cargadas
        document.body.appendChild(img); // Añade al DOM
    });
}

function createBoard() {
    shuffle(duplicatedImages);
    duplicatedImages.forEach(image => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.image = image;

        // Crear el lado posterior de la carta con la imagen de fondo
        const backFace = document.createElement("div");
        backFace.classList.add("back-face");
        backFace.style.backgroundImage = `url('assets/${image}')`;  // La imagen que se mantiene visible

        // Crear el lado frontal de la carta que se revelará al voltear
        const frontFace = document.createElement("div");
        frontFace.classList.add("front-face");
        frontFace.style.backgroundImage = `url('assets/${image}')`;  // Imagen que se verá cuando se voltee

        // Agregar ambos lados al contenedor de la carta
        card.appendChild(backFace);
        card.appendChild(frontFace);

        // Añadir eventos de click y touch
        card.addEventListener("click", flipCard);
        card.addEventListener("touchstart", flipCard);

        gameBoard.appendChild(card);
        cards.push(card);
    });

    // Mostrar ambas caras durante la previsualización
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.add("flipped");  // Voltea todas las cartas para mostrar ambas caras
        });
    }, previewTime);  // Duración de la previsualización (por ejemplo 3 segundos)

    // Después de la previsualización, oculta la parte frontal y muestra solo la parte posterior
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove("flipped");  // Vuelve a ocultar la parte frontal
        });
    }, previewTime + 500);  // Oculta la parte frontal después de la previsualización
}

function flipCard(event) {
    event.preventDefault(); // Evita que el toque se registre dos veces
    if (flippedCards.length < 2 && !this.classList.contains("flipped") && !matchedCards.includes(this)) {
        this.classList.add("flipped");
        this.style.backgroundImage = `url('assets/${this.dataset.image}')`; // Muestra la imagen al voltear
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
        matchedCards.push(card1, card2);
        flippedCards = [];
        
        // Mostrar la imagen correspondiente en el pop-up
        showPopup(card1.dataset.image);

        if (matchedCards.length === cards.length) {
            setTimeout(() => showPopup(imgWinning.png), 3000); // Puedes usar una imagen especial para cuando el jugador gane
        }
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.style.backgroundImage = "";  // Oculta la imagen
            card2.style.backgroundImage = "";  // Oculta la imagen
            flippedCards = [];
        }, 1000);
    }
}

function showPopup(image) {
    // Usa la imagen predeterminada asociada a la carta
    const popupImage = document.createElement("img");
    const popupImageSrc = popupImages[image];  // Obtiene la imagen de pop-up predeterminada para esta carta
    popupImage.src = `assets/${popupImageSrc}`;  // Carga la imagen desde la carpeta 'assets'
    popupImage.alt = "Imagen del pop-up";

    popup.innerHTML = "";  // Limpia cualquier contenido previo del pop-up
    popup.appendChild(popupImage);  // Agrega la imagen al pop-up
    popup.style.display = "block";  // Muestra el pop-up

    setTimeout(() => {
        popup.style.display = "none";  // Oculta el pop-up después de 8 segundos
    }, 8000);
}

// Inicia el juego mostrando el tablero
createBoard();
preloadPopupImages();

// Botón de reinicio
document.getElementById("restartButton").addEventListener("click", () => {
    gameBoard.innerHTML = ""; // Limpia el tablero
    cards = [];
    flippedCards = [];
    matchedCards = [];
    createBoard();
});
