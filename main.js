console.log("App loaded...");
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const semi = ['B', 'C', 'S', 'D'];
let deck = []; // carte nella piramide
let deckInGame = []; // carte da sfogliare
let deckPlayed = []; // carte girate


const GAMEDATA = {
  tableW: 640,
  tableH: 430,
  cardW: 50,
  cardH: 100,
  lineOneCard: 10
}

// fill deck array with cards
// from '1B' ... to '13D'
generateDeck(semi);

// mescola carte
deck = mescolaCarte(deck);

// define cards position
const cardPositions = calcCardPos(GAMEDATA);
// give card position to deck
givePosToCard(cardPositions, deck);

deckInGame = createInGameDeck(deck);
givePositionToDeckInGame(deckInGame, GAMEDATA, deck);
setIddenCard(deck);

// draw all the cards
drawAll(deck, ctx);
drawCardInGame(deckInGame, ctx);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAll(deck, ctx);
  drawCardInGame(deckInGame, ctx);
  drawCardPlayed(deckPlayed, ctx);
  requestAnimationFrame(animate);
}
animate();

canvas.addEventListener("click", e => {
  let point = {x: 0, y: 0};
  let boudRect = canvas.getBoundingClientRect();
  point.y = e.offsetY;
  point.x = e.offsetX;
  if (isInFlip(point, deckInGame)) {
    cardFlip(deckInGame, deckPlayed);
  }

  if (isInOpenCard(point, deck)) {
    playCard(point, deck, deckPlayed);
  }
});