const canvas = document.getElementById("kanvas");
const context = canvas.getContext("2d");
let player = true; // crveni igrač prvi igra
let edges = []; //kreiramo niz ivica u koji cemo kasnije dodavati pocetne i kranje koordinate

//localStorage koji koristim je memorija unutar browsera koju možemo koristit  u igrici
//ona se neće obrisati ako refresujemo stranicu, a localStorage prima samo stringove kao vrijednosti i kao
//ključeve

const width = Number(localStorage.getItem("dimension")); //sirina kanvasa
//name1 i name2 smo setovali u cilimStart.html i pokupili njihove vrijednosti
const name1 = localStorage.getItem("name1"); //ime igraca 1
const name2 = localStorage.getItem("name2"); //ime igraca 2

const squareWidth = canvas.clientWidth / width; //definisemo sirinu kvadrata
const squareHeight = canvas.clientHeight / width; //visinu kvadrata koje koristimo za iscrtavanje kanvasa
context.strokeStyle = "gray"; //postavljamo boju na sivu za iscrtavanje pozadinskih linija (papir)
const squareNumber = 2 * Math.floor(width / 2) * Math.floor(width / 2) + width; //racunamo broj kvadratica
let blueSquaresFilled = 0; //potrebno nam je da pamtimo broj popunjenih plavih kvadratica
let redSquaresFilled = 0; //broj popunjenih crvenih kvadratica


//prolazimo kroz redove i kolone i iscrtavamo kvadrate unutar područja predviđenog za kanvas (definisano u index.html)
for (let i = 0; i < width; i++) {
  for (let j = 0; j < width; j++) {
    context.rect(i * squareWidth, j * squareWidth, squareWidth, squareWidth);
    context.stroke();
  }
}
//Funkcija pomoću koje iscrtavamo segmente iz x, odnosno 2 segmenta, jer čitav oblik ćilima možemo
//podijeliti na četiri segmenta, pa posmatrati po dva. Increment x i y predstavljaju širinu i dužinu jedne linije
//x i y predstavljaju koordinate tacaka
function drawSegmentFromX(context, x, y, incrementX, incrementY, count) {
  for (let i = 0; i < count; i++) {
    console.log(x + " " + y);
    context.beginPath();
    //iscrtavanje jedne linije
    let [startX, startY] = [x / Math.abs(incrementX), y / Math.abs(incrementY)];
    console.log("Pocetna tačka "+[startX,startY]);
    context.moveTo(x, y);
    console.log(x + " " + y);
    y += incrementY;
    let [endX, endY] = [x / Math.abs(incrementX), y / Math.abs(incrementY)];
    console.log("Krajnja tačka "+[endX,endY]);
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    // do ovog dijela se vrsi iscrtavanje
    //u niz ivice dodajemo koordinate oba ruba, odnosno koordinate tacke odakle pocinjemo i tacke gdje zavrsavamo
    edges.push({
      startX: Math.round(startX), //x koordinata pocetne tacke
      startY: Math.round(startY), //y koordinata početne tačke
      endX: Math.round(endX), //x koordinata tačke do koje vršimo iscrtavanje
      endY: Math.round(endY), //y koordinata tačke do koje vršimo iscrtavanje
      color: "black"
    });
    context.beginPath();
    context.moveTo(x, y);
    [startX, startY] = [x / Math.abs(incrementX), y / Math.abs(incrementY)];

    x += incrementX;
    [endX, endY] = [x / Math.abs(incrementX), y / Math.abs(incrementY)];
    context.lineTo(x, y);
    //dodajemo iscrtanu ivicu u niz, odnosno njene početne i krajnje koordinate
    edges.push({
      startX: Math.round(startX),
      startY: Math.round(startY),
      endX: Math.round(endX),
      endY: Math.round(endY),
      color: "black"
    });
    console.log(x + " " + y);
    context.closePath();
    context.stroke();
  }
}
//Funkcija pomoću koje iscrtavamo segmente iz y, odnosno 2 segmenta, jer čitav oblik ćilima možemo
//podijeliti na četiri segmenta, pa posmatrati po dva. Increment x i y predstavljaju širinu i dužinu jedne linije
//x i y predstavljaju koordinate tacaka. Ideja koju koristimo je ista kao u drawSegmentFromX. Razlika između
//ove dvije funkcije, tačnije drawSegmentFromX i drawSegmentFromY jeste što jedna ide po visini prilikom iscrtavanja
// a druga po širini
function drawSegmentFromY(context, x, y, incrementX, incrementY, count) {
  for (let i = 0; i < count; i++) {
    console.log(x + " " + y);
    context.beginPath();
    context.moveTo(x, y);
    let [startX, startY] = [x / Math.abs(incrementX), y / Math.abs(incrementY)];
    //ovdje određujemo i dodjeljujemo vrijednosti koordinata početne tačke,
    // tačnije način na koji dobijamo za svaku ivicu njenu početnu taču
    console.log("Pocetna tačka "+[startX,startY]);
    x += incrementX;
    //na isti način kao i za početne, tako dobijamo i krajnje tačke ivica
    let [endX, endY] = [x / Math.abs(incrementX), y / Math.abs(incrementY)];
    console.log("Krajnja tačka "+[endX,endY]);
    context.lineTo(x, y);
    edges.push({
      startX: Math.round(startX), //zaokružujemo koordinate na cijele brojeve (posljedica dijeljenja)
      startY: Math.round(startY),
      endX: Math.round(endX),
      endY: Math.round(endY),
      color: "black"
    });
    console.log(x + " " + y);
    context.closePath();
    context.stroke();
    context.beginPath();
    [startX, startY] = [x / Math.abs(incrementX), y / Math.abs(incrementY)];
    context.moveTo(x, y);
    console.log(x + " " + y);
    y += incrementY;
    [endX, endY] = [x / Math.abs(incrementX), y / Math.abs(incrementY)];
    context.lineTo(x, y);
    context.closePath();
    context.stroke();
    //dodajemo iscrtane ivice u niz, tačnije početne i krajnje koordinate tih ivica
    edges.push({
      startX: Math.round(startX),
      startY: Math.round(startY),
      endX: Math.round(endX),
      endY: Math.round(endY),
      color: "black"
    });
  }
}

function areEdgesEqual(a, b) { //Ova funkcija je pomoćna, a koristimo je prilikom ispitivanja da li su dvije
  return a.startX === b.startX && //ivice koje su proslijeđene kao parametri iste, iste se odnosi da je to
      a.startY === b.startY && //baš ta ivica, tj. ivica a ima iste koordinate kao b. Koristimo je u fji
      a.endX === b.endX && //didFill
      a.endY === b.endY;
}

const halfWidth = Math.floor((width / 2)); //za iscrtavanje nam je potrebno i da nađemo polovinu sirine kanvasa
let y = halfWidth * squareWidth; //koordinata y koja nam govori odakle trebamo poceti iscrtavanje oblika
let x = 0; //x koordinata za iscrtavanje oblika

context.strokeStyle = "black";
context.lineWidth = 5; //pomoću ove funkcije postavljamo debljinu linije kojom iscrtavamo oblik baklave
//pomoću dolje navedene funkcije iscrtavamo oblik baklave po svim segmentima i u niz ivice dodajemo koordinate
//početnih i krajnjih tačaka ivice koju smo već iscrtali
function drawInitialCarpet() {
  //za pocetak gledamo u odnosu na x-osu jer je x jednako 0 i iscrtavamo taj dio, tj. iscrtavamo po segmentima
  drawSegmentFromY(context, x, y, squareWidth, -squareHeight, halfWidth);
  //određujemo polazne koordinate za iscrtavanje
  y = 0;
  x = (halfWidth + 1) * squareWidth;
  //ovdje posmatramo u odnosu na y-osu iscrtavanje jer imamo da je x=0
  drawSegmentFromX(context, x, y, squareWidth, squareHeight, halfWidth);
  y = (halfWidth + 1) * squareWidth;
  x = 0;
  drawSegmentFromY(context, x, y, squareWidth, squareHeight, halfWidth);
  y = width * squareWidth;
  x = (halfWidth + 1) * squareWidth;
  drawSegmentFromX(context, x, y, squareWidth, -squareHeight, halfWidth);
  x = 0;
  y = halfWidth * squareHeight;
  context.beginPath();
  context.moveTo(x, y);
  console.log(x + " " + y);
  let [startX, startY] = [x / Math.abs(squareWidth), y / Math.abs(squareHeight)];
  y += squareHeight;
  let [endX, endY] = [x / Math.abs(squareWidth), y / Math.abs(squareHeight)];
  edges.push({ //dodajemo iscrtane ivice u niz
    startX,
    startY,
    endX,
    endY,
    color: "black"
  });
  context.lineTo(x, y);
  context.closePath();
  context.stroke();
  x = width * squareWidth;
  y = halfWidth * squareHeight;
  context.beginPath();
  context.moveTo(x, y);
  [startX, startY] = [x / Math.abs(squareWidth), y / Math.abs(squareHeight)];
  console.log(x + " " + y);
  y += squareHeight;
  [endX, endY] = [x / Math.abs(squareWidth), y / Math.abs(squareHeight)];
  edges.push({
    startX,
    startY,
    endX,
    endY,
    color: "black"
  });
  context.lineTo(x, y);
  context.closePath();
  context.stroke();

  x = halfWidth * squareWidth;
  y = 0;
  [startX, startY] = [x / Math.abs(squareWidth), y / Math.abs(squareHeight)];
  context.beginPath();
  context.moveTo(x, y);
  console.log(x + " " + y);
  x += squareWidth;
  [endX, endY] = [x / Math.abs(squareWidth), y / Math.abs(squareHeight)];
  edges.push({
    startX,
    startY,
    endX,
    endY,
    color: "black"
  });
  context.lineTo(x, y);
  context.closePath();
  context.stroke();
  x = halfWidth * squareWidth;
  y = width * squareHeight;
  [startX, startY] = [x / Math.abs(squareWidth), y / Math.abs(squareHeight)];
  context.beginPath();
  context.moveTo(x, y);
  console.log(x + " " + y);
  x += squareWidth;
  [endX, endY] = [x / Math.abs(squareWidth), y / Math.abs(squareHeight)];
  edges.push({
    startX,
    startY,
    endX,
    endY,
    color: "black"
  });
  context.lineTo(x, y);
  context.closePath();
  context.stroke();
}

drawInitialCarpet();
console.log(edges);
edges = edges.map(e => {
  if (e.startX > e.endX || e.startY > e.endY) {
    return {
      startX: e.endX,
      startY: e.endY,
      endX: e.startX,
      endY: e.startY,
      color: e.color
    };
  } else {
    return e;
  }
});

function drawLine(context, startX, startY, endX, endY) {
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.closePath();
  context.stroke();
}

function didFill() {
  const lastEdge = edges[edges.length - 1]; //pamtimo posljednje dodanu ivicu u niz
  const lastEdgar = { //posto koristimo {} zagrade deklarišemo objekat u kojem cuvamo koordinate zadnje
    startX: lastEdge.startX, //dodate ivice, tačnije koordinate početne i krajnje tačke posljednje dodane ivice
    startY: lastEdge.startY,
    endX: lastEdge.endX,
    endY: lastEdge.endY
  }
  let edgars = edges.map(edge => {
    return {
      startX: edge.startX,
      startY: edge.startY,
      endX: edge.endX,
      endY: edge.endY
    }
  });
  let result = [];
  if (lastEdge.startX === lastEdge.endX) {
    // vertical line
    // provjeravamo jedan lijevi
    // . _ . top
    // |   | left and right
    // . _ . bottom
    let top = {
      startX: lastEdge.startX - 1,
      startY: lastEdge.startY,
      endX: lastEdge.startX,
      endY: lastEdge.startY
    }
    let left = {
      startX: lastEdge.startX - 1,
      startY: lastEdge.startY,
      endX: lastEdge.endX - 1,
      endY: lastEdge.endY
    }
    let bottom = {
      startX: lastEdge.startX - 1,
      startY: lastEdge.endY,
      endX: lastEdge.startX,
      endY: lastEdge.endY
    }
    // ako u obojenim linijama se nalaze one linije koje zaklapaju kvadrat sa zadnje dodanom
    if (
        edgars.filter(e => areEdgesEqual(e, top)).length > 0 &&
        edgars.filter(e => areEdgesEqual(e, left)).length > 0 &&
        edgars.filter(e => areEdgesEqual(e, bottom)).length > 0
    ) {
      result.push({
        topLeftX: lastEdge.startX - 1,
        topLeftY: lastEdge.startY,
        bottomRightX: lastEdge.startX,
        bottomRightY: lastEdge.endY,
        color: lastEdge.color
      });
    }
    // provjeravamo jedan desni
    top = {
      startX: lastEdge.startX,
      startY: lastEdge.startY,
      endX: lastEdge.startX + 1,
      endY: lastEdge.startY
    }
    let right = {
      startX: lastEdge.startX + 1,
      startY: lastEdge.startY,
      endX: lastEdge.endX + 1,
      endY: lastEdge.endY
    }
    bottom = {
      startX: lastEdge.startX,
      startY: lastEdge.endY,
      endX: lastEdge.startX + 1,
      endY: lastEdge.endY
    }
    console.log(bottom);
    console.log(edgars.filter(e => areEdgesEqual(e, top)).length > 0);
    console.log(edgars.filter(e => areEdgesEqual(e, right)).length > 0);
    console.log(edgars.filter(e => areEdgesEqual(e, bottom)).length > 0);
    // ako u obojenim linijama se nalaze one linije koje zaklapaju kvadrat sa zadnje dodanom
    if (
        edgars.filter(e => areEdgesEqual(e, top)).length > 0 &&
        edgars.filter(e => areEdgesEqual(e, right)).length > 0 &&
        edgars.filter(e => areEdgesEqual(e, bottom)).length > 0
    ) {
      result.push({
        topLeftX: lastEdge.startX,
        topLeftY: lastEdge.startY,
        bottomRightX: lastEdge.startX + 1,
        bottomRightY: lastEdge.endY,
        color: lastEdge.color
      });
    }
  }
  else {
    let top = {
      startX: lastEdge.startX,
      startY: lastEdge.startY - 1,
      endX: lastEdge.endX,
      endY: lastEdge.endY - 1
    }
    let left = {
      startX: lastEdge.startX,
      startY: lastEdge.startY - 1,
      endX: lastEdge.endX - 1,
      endY: lastEdge.endY
    }
    let right = {
      startX: lastEdge.startX + 1,
      startY: lastEdge.startY - 1,
      endX: lastEdge.endX,
      endY: lastEdge.endY
    }
    // ako u obojenim linijama se nalaze one linije koje zaklapaju kvadrat sa zadnje dodanom
    console.log(edgars.filter(e => areEdgesEqual(e, top)).length > 0);
    console.log(edgars.filter(e => areEdgesEqual(e, left)).length > 0);
    console.log(edgars.filter(e => areEdgesEqual(e, right)).length > 0);
    if (
        edgars.filter(e => areEdgesEqual(e, top)).length > 0 &&
        edgars.filter(e => areEdgesEqual(e, left)).length > 0 &&
        edgars.filter(e => areEdgesEqual(e, right)).length > 0
    ) {
      result.push({
        topLeftX: lastEdge.startX,
        topLeftY: lastEdge.startY - 1,
        bottomRightX: lastEdge.endX,
        bottomRightY: lastEdge.endY,
        color: lastEdge.color
      });
    }
    // Dakle, trebamo provjeriti ako imamo iscrtanu donju liniju, i dvije linije sa strane
    left = {
      startX: lastEdge.startX,
      startY: lastEdge.startY,
      endX: lastEdge.endX - 1,
      endY: lastEdge.endY + 1
    }
    right = {
      startX: lastEdge.startX + 1,
      startY: lastEdge.startY,
      endX: lastEdge.endX,
      endY: lastEdge.endY + 1
    }
    let bottom = {
      startX: lastEdge.startX,
      startY: lastEdge.startY + 1,
      endX: lastEdge.endX,
      endY: lastEdge.endY + 1
    }
    // ako u obojenim linijama se nalaze one linije koje zaklapaju kvadrat sa zadnje dodanom
    if (
        edgars.filter(e => areEdgesEqual(e, left)).length > 0 &&
        edgars.filter(e => areEdgesEqual(e, right)).length > 0 &&
        edgars.filter(e => areEdgesEqual(e, bottom)).length > 0
    ) {
      result.push({
        topLeftX: lastEdge.startX,
        topLeftY: lastEdge.startY,
        bottomRightX: lastEdge.endX,
        bottomRightY: lastEdge.endY + 1,
        color: lastEdge.color
      });
    }
  }
  return result;
}
//funkcija koja boji kvadratiće u onu boju za koju je zadovoljen određeni uslov igre
function fillRects(rects) {
  for (const r of rects) {
    context.fillStyle = r.color;
    console.log(r);
    if (r.color === "red") { //odnos broja popunjenih plavih i crvenih kvadratica nam je potreban za ispisivanje pobjednika
      redSquaresFilled++; //povecavamo broj obojenih kvadratica u crvenu boju
    } else {
      blueSquaresFilled++; //povecavamo broj kvadratica obojenih u plavu boju
    }
    //brojeve koje dodajemo, odnosno oduzimamo služe nam kako bismo omogućili
    // da se vide obojene ivice i dodali malo praznine u odnosu na ukupnu površinu kvadrata
    context.fillRect(r.topLeftX * squareWidth + 5, r.topLeftY * squareHeight + 5, squareWidth - 10, squareHeight - 10);
  }
}
//funkcija pomoću koje iscrtavamo ivice kvadrata u odnosu na boju, da li je igrač koji je na redu za potez
//prvi, odnosno drugi, iscrtava se crvena ili plava ivica na mjestu na kojem je igrač ostvario svoj potez
function drawEdge(context, edge, color) {
  context.strokeStyle = color;
  drawLine(context, edge.startX * squareWidth, edge.startY * squareHeight, edge.endX * squareWidth, edge.endY * squareHeight);
}

edges.push({
  startX: Math.floor(width / 2),
  startY: 1,
  endX: Math.floor(width / 2) + 1,
  endY: 1,
  color: "red"
});
//odavde pocinje dio koji se odnosi na bojenje kvadrata koji dođu na početku igre obojeni
drawEdge(context, edges[edges.length-1], "red");
console.log("---------------");
console.log(edges[edges.length - 1]);
fillRects(didFill());

edges.push({
  startX: width - 1,
  startY: Math.floor(width / 2),
  endX: width - 1,
  endY: Math.floor(width / 2) + 1,
  color: "red"
});
drawEdge(context, edges[edges.length-1], "red");
console.log("Ovaj je ...");
fillRects(didFill());
console.log("Ovaj je ...");

edges.push({
  startX: 1,
  startY: Math.floor(width / 2),
  endX: 1,
  endY: Math.floor(width / 2) + 1,
  color: "blue"
});
drawEdge(context, edges[edges.length-1], "blue");
fillRects(didFill());

edges.push({
  startX: Math.floor(width / 2),
  startY: width - 1,
  endX: Math.floor(width / 2) + 1,
  endY: width - 1,
  color: "blue"
});
drawEdge(context, edges[edges.length-1], "blue");
fillRects(didFill());
//ovdje se zavrsava dio koda koji se odnosi na bojenje kvadratica na ivicama baklave
canvas.addEventListener("click", function (event) {
  player = !player;
  context.strokeStyle = (player) ? "blue" : "red"; //u zavisnosti od određenog uslova dodjeljujemo boju
  const bounds = canvas.getBoundingClientRect(); //uzimamo granice kanvasa

  const pointerX = event.clientX - bounds.left; //razlika između koordinate koja je kliknuta i gornjeg ugla za x koordinatu
  const pointerY = event.clientY - bounds.top; //također, za y koordinatu
  // gornji desni
  // donji lijevi
  // donji desni
  // gornje lijevi
  if (
      pointerX > pointerY + halfWidth * squareWidth ||
      pointerX + halfWidth * squareHeight < pointerY ||
      width * squareWidth - pointerX < pointerY - halfWidth * squareWidth ||
      width * squareWidth - pointerX > pointerY + halfWidth * squareWidth
  ) {
    return true;
  }
  //potrebno je da posmatramo ostatak pri dijeljenju od koordinate x koju smo iznad definisali i širine
  //kvadrata kako bismo odredili početnu x koordinatu od naše linije koja se iscrtava. Jer ćemo
  //u odnosu na kliknute koordinate stare x i y dobiti određeno pomjeranje, pa je potrebno izvršiti pomjeranje
  //po ovom modulu
  let lineStartX = pointerX - (pointerX % squareWidth);
  let lineStartY = pointerY - (pointerY % squareWidth);
  //ovdje sacuvamo ostatke pri dijeljenju koje smo iznad iskoristili
  let pointerInRectX = pointerX % squareWidth;
  let pointerInRectY = pointerY % squareWidth;
  context.lineWidth = 5;
  let startX, startY, endX, endY; //definišemo nove varijable koje nam označavaju koordinate x i y
  //početne tačke i krajnje tačke za koje vršimo iscrtavanje
  //određujemo kojoj liniji smo najbliži. Tj. dijelimo kvadrat na četiri dijela.
  //Ideja iskorištena sa vježbi od profesorice Eldine
  //ovaj dio se odnosi na to u kojem dijelu se našeg oblika nalazimo u odnosu na dijagonalu kvadrata
  if (pointerInRectX < pointerInRectY && pointerInRectX + pointerInRectY < squareWidth) {
    startX = Math.floor(lineStartX / squareWidth);  //zaokruzujemo na najmanje cijelo da ne bi doslo do odstupanja
    startY = Math.floor(lineStartY / squareWidth);
    endX = Math.floor(lineStartX / squareWidth);
    endY = Math.floor((lineStartY + squareHeight) / squareWidth);
  } else if (pointerInRectX < pointerInRectY && pointerInRectX + pointerInRectY > squareWidth) {
    startX = Math.floor(lineStartX / squareWidth);
    startY = Math.floor((lineStartY + squareHeight) / squareWidth);
    endX = Math.floor((lineStartX + squareWidth) / squareWidth);
    endY = Math.floor((lineStartY + squareHeight) / squareHeight);
  } else if (pointerInRectX > pointerInRectY && pointerInRectX + pointerInRectY > squareWidth) {
    startX = Math.floor((lineStartX + squareWidth) / squareWidth);
    startY = Math.floor((lineStartY) / squareWidth);
    endX = Math.floor((lineStartX + squareWidth) / squareWidth);
    endY = Math.floor((lineStartY + squareHeight) / squareWidth);
  } else {
    startX = Math.floor(lineStartX / squareWidth);
    startY = Math.floor(lineStartY / squareWidth);
    endX = Math.floor((lineStartX + squareWidth) / squareWidth);
    endY = Math.floor(lineStartY / squareWidth);
  }
  const edge = {
    startX,
    startY,
    endX,
    endY,
    color: player ? "blue" : "red" //ovo znaci da varijabli color u zavisnosti od nekog uslova dodjeljujemo
                                    //ili plavu ili crvenu boju.
  };
  let present = false;
  console.log(edge);
  for (let e of edges) {
    console.log(e);
    if (
        startX === e.startX &&
        startY === e.startY &&
        endX === e.endX &&
        endY === e.endY
    ) {
      present = true;
      break;
    }
  }

  if (present) {
    player = !player;
  } else {
    edges.push(edge);
    const result = didFill();
    if (result.length > 0) {
      player = !player;
    }
    fillRects(result);
    console.log(result);
    drawLine(context, startX * squareWidth, startY * squareHeight, endX * squareWidth, endY * squareHeight);
  }
  console.log(edges);
  console.log("Broj crvenih popunjenih kvadratića: " + redSquaresFilled);
  console.log("Broj plavih popunjenih kvadratića: " + blueSquaresFilled);
  /*ovaj dio za dugme koje ce se prikazati je modifikovano sa https://codepen.io/davidcochran/pen/WbWXoa */
  function newGame(){
    // 1. Create the button
    var button = document.createElement("button");
    button.innerHTML = "Nova igra";

// 2. Append somewhere
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);

// 3. Add event handler
    button.addEventListener ("click", function() {
      location.reload();
      location.href = 'start.html'
    });
  }

  function newTie(){
    // 1. Create the button
    var button = document.createElement("button");
    button.innerHTML = "Nova igra za revanš";

// 2. Append somewhere
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);

// 3. Add event handler
    button.addEventListener ("click", function() {
      location.reload();
      location.href = 'start.html'
    });
  }

  function backToWelcomePage(){
    // 1. Create the button
    var button = document.createElement("button");
    button.innerHTML = "Povratak na naslovnu stranicu";

// 2. Append somewhere
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);

// 3. Add event handler
    button.addEventListener ("click", function() {
      location.reload();
      location.href = 'indeks.html'
    });
  }
  /*ovdje se zavrsava*/
  let message = "";
  //ispitujemo da li je cijela ploca koja je namijenjena za igru popunjena, dakle unutrasnjost oblika
  //baklave i shodno tome ispisujemo poruku o revanšu ili ime pobjednika
  if (redSquaresFilled + blueSquaresFilled === squareNumber) {
    //provjeravamo da li imamo jednak broj popunjenih plavih i crvenih kvadrata
    if (redSquaresFilled === blueSquaresFilled) {
      message = name1 + " " + name2 +" imate revanš!";
      //da li imamo veci broj crvenih u odnosu na plave
      /*ovaj dio za dugme koje ce se prikazati je prekopirano sa https://codepen.io/davidcochran/pen/WbWXoa */
      newTie();
      backToWelcomePage();

      /*do ovog dijela*/
    }
    else if (redSquaresFilled > blueSquaresFilled) {
      message = name1 + " je pobijedio/la!";
      /*sa iste stranice i ovaj dio prekopiran, iznad navedena stranica*/
      newGame();
      backToWelcomePage();
    } else {
      //da li je veci broj popunjenih plavih kvadrata u odnosu na crvene
      message = name2 + " je pobijedio/la";
      newGame();
      backToWelcomePage();
    }
    setTimeout(()=>{ //ovu funkciju koristimo kako bismo omogućili da se poruka ispiše u browseru
      alert(message);       //nakon iscrtavanja i popunjavanja posljednjeg kvadratica, a ne neposredno prije
    },20);           //a potom da dođe do iscrtavanja
  }
});
