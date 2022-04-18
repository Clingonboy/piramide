function generateDeck(semi) {
  for (let v = 1; v <= 13; v++) {
    for (let s = 0; s < 4; s++) {
      let imgcart = document.getElementById(
        `${v}${semi[s]}`
      );
      let cart = new Carta(semi[s], v, imgcart);
      deck.push(cart);
    }
  }
}

function calcCardPos (gamedata) {
  let offsetX = Math.floor((gamedata.tableW - (gamedata.cardW * gamedata.lineOneCard)) / (gamedata.lineOneCard + 1));
  let offsetY = 5;
  let piramidN = 3;
  let positions = [[], [], [], []];
  let x0 = 0;
  let gep = offsetX + gamedata.cardW;
  
  // fourth line
  x0 = gamedata.cardW * 2 + offsetX * 2.5;
  for (let i = 0; i < piramidN; i++) {
    positions[3].push(
      {
        x: x0 + gep * 3 * i,
        y: gamedata.cardH / 2
      }
    );
  }

  // third line
  x0 = gamedata.cardW * 1.5 + offsetX *2;
  for (let i = 0; i < piramidN; i++) {
    for (let j = 0; j < 2; j++) {
      positions[2].push(
        {
          x: x0 + gep * j,
          y: gamedata.cardH + offsetY
        }
      );
    }
    //--
    x0 += gep * 3;
  }

  // second line
  x0 = gamedata.cardW + offsetX + offsetX / 2;
  for (let i = 0; i < piramidN; i++) {
    for (let j = 0; j < 3; j++) {
      positions[1].push(
        {
          x: x0 + gep * j,
          y: 1.5 * gamedata.cardH + 2 * offsetY
        }
      );
    }
    //--
    x0 += gep * 3;
  }

  // first line
  x0 = offsetX + gamedata.cardW / 2;
  for (let i = 0; i < gamedata.lineOneCard; i++) {
    positions[0].push(
      {
        x: x0 + gep * i,
        y: 2 * gamedata.cardH + 3 * offsetY
      }
    );
  }

  return positions;
}

// funzione per mescolare le carte
function mescolaCarte (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function givePosToCard (positions, deck) {
  let count = 0;
  for (let i = positions.length -1; i >= 0; i--) {
    for (let j = 0; j < positions[i].length; j++) {
      deck[count].x = positions[i][j].x;
      deck[count].y = positions[i][j].y;
      count += 1;
    }
  }
}

function drawAll (deck, ctx) {
  for (let i = 0; i < deck.length; i++) {
    deck[i].drawCart(ctx);
  }
}

function createInGameDeck(deck) {
  return deck.splice(28, 24);
}

function givePositionToDeckInGame(deckInGame, gamedata, deck) {
  let posy = 0;
  let posx = 0;
  for (let i = 0; i < deck.length; i++) {
    if (deck[i].y > posy) {
      posy = deck[i].y;
    }
  }
  posy += gamedata.cardH + 30;
  posx = gamedata.tableW / 2 - gamedata.cardW;

  for (let i = 0; i < deckInGame.length; i++) {
    deckInGame[i].y = posy;
    deckInGame[i].x = posx;
    deckInGame[i].isOpen = false;
  }
}

function drawCardInGame (card, ctx) {
  for (let i = 0; i < card.length; i++) {
    card[i].drawCart(ctx);
  }
}

function drawCardPlayed (card, ctx) {
  if (card.length > 0) {
    for (let i = 0; i < card.length; i++) {
      card[i].drawCart(ctx);
    }
  }
}

function setIddenCard(deck) {
  let lastRowY = 0;
  for (let i = 0; i < deck.length; i++) {
    if (deck[i].y > lastRowY) {
      lastRowY = deck[i].y
    }
  }

  for (let i = 0; i < deck.length; i++) {
    if (deck[i].y < lastRowY) {
      deck[i].isOpen = false;
    }
  }
}

function cardFlip (deckInGame, deckPlayed) {
  if (deckInGame.length > 0) {
    let tcard = deckInGame.pop();
    tcard.isOpen = true;
    tcard.x = GAMEDATA.tableW / 2 + GAMEDATA.cardW;
    deckPlayed.push(tcard);
  } else {
    console.log("Carte finite!!");
  }
}

function isInFlip (point, deckInGame) {
  if (deckInGame.length > 0) {
    let x0 = deckInGame[0].x - deckInGame[0].w /2;
    let x1 = deckInGame[0].x + deckInGame[0].w /2;
    let y0 = deckInGame[0].y - deckInGame[0].h /2;
    let y1 = deckInGame[0].y + deckInGame[0].h /2;
    if (point.x > x0 && point.x < x1 && point.y > y0 && point.y < y1) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function isInOpenCard (point, deck) {
  if (deck.length > 0) {
    for (let i = 0; i < deck.length; i++) {
      let c = deck[i];
      //console.log(c);
      if (c.isOpen === true) {
        let x0 = c.x - c.w / 2;
        let x1 = c.x + c.w / 2;
        let y0 = c.y - c.h / 2;
        let y1 = c.y + c.h / 2;
        if (point.x > x0 && point.x < x1 && point.y > y0 && point.y < y1) {
          return i;
        }
      }
    }
  }
  return false;
}

function playCard (point, deck, deckPlayed) {
  if (deckPlayed.length < 1) {
    return
  }

  let n = isInOpenCard(point, deck);
  console.log(`Hai clieccato la carta con seme: ${deck[n].seme} e valore ${deck[n].valore}`)
  
  // controllo se è una carta valida
  let valCPlay = deck[n].valore; // carta cliccata
  let valCAtt = deckPlayed[deckPlayed.length - 1].valore; // carta in attesa

  console.log(`-${valCPlay}--${valCAtt}`);

  if (valCAtt == (valCPlay + 1) || valCAtt == (valCPlay - 1)) {
    let c = deck.splice(n, 1)[0];
    c.x = deckPlayed[0].x;
    c.y = deckPlayed[0].y;
    deckPlayed.push(c);
    let pp = parseInt(document.getElementById("punteggio").innerHTML)
    document.getElementById("punteggio").innerHTML = (pp+1);
    document.getElementById("messaggio").innerHTML = "Bravo";
    checkOpenCard(deck);
  } else {
    document.getElementById("messaggio").innerHTML = "Hai scelto una carta non valida";
  }
}

function checkOpenCard(deck) {
  for (let i = 0; i < deck.length; i++) {
    let list = 0
    for (let j = 0; j < deck.length; j++) {
      if ( deck[j].y > deck[i].y ) {
        if ((Math.abs(deck[j].x - deck[i].x) < deck[i].w) && (Math.abs(deck[j].y - deck[i].y) < deck[i].h) && (Math.abs(deck[j].y - deck[i].y) != 0) ) {
          list += 1;
        }
      }
    }
    if (list === 0) { deck[i].isOpen = true; }
  }
}