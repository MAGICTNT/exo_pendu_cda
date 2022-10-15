const BordGame = document.getElementById("jeux");
const ListeMots = ["EMPHASE", "ALIGNES", "PONTIFE", "CENTRAL", "MEDIANS", "FRUIT", "DACCA", "antilope", "assurance", "crayon", "embrasse", "distorsion", "élévation", "contrebandier", "divinité", "pourrir", "grosse", "tête", "poète", "dix", "apiculteur", "dynamitage", "horloge", "comité", "bombe", "brut", "biberonner", "gelé", "fémur", "bizarre", "ceinture", "reine", "révolte", "concept", "crier", "toxique", "décodeur", "avantage", "composé"];
const ListeLettre = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const caractereSpecial = "àéèêëç";
const caractereConvertie = "aeeeec";
let toucheUtiliser = "";
let motMystereActuelle = "";
let motTempon = "";
let nombreErreur = 0;
let score = 5;
let correct = 0;
let nombreMotCorrecteVictoire = 5;

initialisation(motMystereActuelle);

function initialisation(motMystereActuelle) {
  generationImage();
  generationMotCacher();
  miseEnFormeMotCacher(motMystereActuelle);
  generationTouche();
  generationInfo();
  actualisationAffichage();
}

function generationImage() {
  let div = document.createElement('div');
  div.className = "row";
  div.id = "containeurImage";
  let img = document.createElement('img');
  img.id = "imagePendu";
  img.src = "img/pendu_0.png";
  div.appendChild(img);
  BordGame.appendChild(div);
}

function changerImage(numeroErreur) {
  let img = document.getElementById("imagePendu");
  if (numeroErreur >= 0 && numeroErreur <= 4) {
    img.src = `img/pendu_${numeroErreur}.png`;
  }
}

function generationMotCacher() {
  let div = document.createElement("div");
  div.className = "row";
  div.id = "baliseMotMystere";

  let p = document.createElement("p");
  p.id = "motMystere";
  div.appendChild(p);
  BordGame.appendChild(div);
}

function miseEnFormeMotCacher(motSelectionner) {
  let random = Math.floor(Math.random() * ListeMots.length);
  motPendu = document.getElementById("motMystere");
  let motATrouver = ListeMots[random].toUpperCase();
  ListeMots.splice(ListeMots.indexOf(motATrouver), 1);
  motCacher = motATrouver;
  motTempon = "";
  if (motATrouver != null) {
    motSelectionner = motATrouver.toUpperCase().replace(/[\D]/g, "_");
    motTempon = generationMotNeutre(motATrouver, motTempon);

  }
  motPendu.textContent = motSelectionner;
}

function generationMotNeutre(mot, motSansLettreSpecial) {
  for (let i = 0; i < motCacher.length; i++) {
    if (caractereSpecial.toUpperCase().indexOf((motCacher.slice(i, i + 1).toUpperCase())) !== -1) {
      motSansLettreSpecial += caractereConvertie.slice(caractereSpecial.indexOf(mot.slice(i, i + 1).toLowerCase()), caractereSpecial.indexOf(mot.slice(i, i + 1).toLowerCase()) + 1).toUpperCase();
    } else {
      motSansLettreSpecial += motCacher.slice(i, i + 1);
    }
  }
  return motSansLettreSpecial;
}


function generationTouche() {
  let divPrincipal = document.createElement('div');
  let divClavier = document.createElement('div');
  divClavier.id = "clavier";
  divPrincipal.id = "divPrincipalClavier";
  divPrincipal.className = "row";

  for (i = 0; i < ListeLettre.length; i++) {
    let button = document.createElement('button');
    let nomButton = document.createTextNode(ListeLettre.at(i));
    let buttonSelection = `button${i}`;
    button.id = ListeLettre.at(i);
    buttonSelection = document.getElementById(ListeLettre.at(i));
    button.addEventListener("click", clic);

    addBr(i, 13, button, nomButton, divClavier);

    button.appendChild(nomButton);
    divClavier.appendChild(button);
  }
  divPrincipal.appendChild(divClavier);
  BordGame.appendChild(divPrincipal);
}

function addBr(chiffreBoucle, nombreButton, buttonCree, nomButton, divParent) {
  if (chiffreBoucle % nombreButton === 0 && chiffreBoucle !== 0) {
    let br = document.createElement('br');
    br.className = "brClavier";
    buttonCree.appendChild(nomButton);
    divParent.appendChild(buttonCree);
    divParent.appendChild(br);
  }
}

function generationInfo() {
  let div = document.createElement("div");
  div.className = "row";
  let p = document.createElement("p");
  p.id = "zoneInfo";
  p.innerHTML = "<p id='information'><span id='chance'></span> / <span id='erreur'></span></p>"
  div.appendChild(p);
  BordGame.appendChild(div);
}


function clic() {
  if (toucheUtiliser.indexOf(this.textContent) === -1) {
    gestionActiviterButton(this.textContent, true);
    controleSaisie(this.textContent);
    actualisationAffichage();
  }
}

function controleSaisie(valueControl) {
  (motTempon.indexOf(controleCaractere(valueControl)) !== -1) ? actualisationMot(controleCaractere(valueControl)) : erreur(controleCaractere(valueControl));
}

document.addEventListener('keydown', function (e) {
  if (toucheUtiliser.indexOf(e.key.toUpperCase()) === -1 && e.key.match("[A-Za-zàçèéêë]")) {
    gestionActiviterButton(e.key.toUpperCase(), true);
    controleSaisie(e.key.toUpperCase());
    actualisationAffichage();
  }
})

function actualisationMot(valueControl) {
  colorButton(controleCaractere(valueControl), true);
  let motPendu = document.getElementById("motMystere");
  let lettreTrouver = motPendu.textContent;
  let motSelectionner = "";
  for (i = 0; i < motCacher.length; i++) {
    if (lettreTrouver.slice(i, i + 1) === "_") {
      (motTempon.slice(i, i + 1).toUpperCase() === valueControl) ? motSelectionner += motCacher.slice(i, i + 1) : motSelectionner += "_";
    } else {
      motSelectionner += lettreTrouver.slice(i, i + 1);
    }
  }
  motPendu.textContent = motSelectionner;
  controlMotFini(motSelectionner);
}


function nextGame() {
  score -= (nombreErreur > 0) ? 1 : 0;
  if (score >= 0) {
    nombreErreur = 0;
    actualisationAffichage();
    changerImage(nombreErreur);
    miseEnFormeMotCacher(motMystereActuelle);
    verouilleClavier(false);
    rebootAllButton();
    toucheUtiliser = "";
  } else {
    setTimeout(alert("Partie perdu"), 2500);
  }
}

function erreur(valueControl) {
  nombreErreur++;
  colorButton(valueControl, false);
  changerImage(nombreErreur);
  if (nombreErreur > 3) {
    verouilleClavier(true);
    setTimeout(nextGame, 2500);
  }
}


function rebootAllButton() {
  for (i = 0; i < toucheUtiliser.length; i++) {
    let button = document.getElementById(toucheUtiliser.at(i));
    button.className = "";
    button.disabled = false;
  }
}

function verouilleClavier(boolean) {
  for (i = 0; i < ListeLettre.length; i++) {
    button = document.getElementById(ListeLettre.at(i));
    button.disabled = boolean;
  }
}

function finDePartie(nombre) {
  if (nombre >= nombreMotCorrecteVictoire) {
    setTimeout(alert("Fin de partie vous avez gagnez"), 2500);
  }
}


function controlMotFini(mot) {
  if (mot === motCacher) {
    correct++;
    verouilleClavier(true);
    finDePartie(correct);
    setTimeout(nextGame, 2500);
  }
}

function colorButton(valueControl, etat) {
  let buttonColor = document.getElementById(valueControl);
  if (etat) {
    buttonColor.className = " green";
  } else {
    buttonColor.className = " red";
  }
}

function actualisationAffichage() {
  let chance = document.getElementById("chance");
  let erreur = document.getElementById("erreur");
  chance.textContent = "Encore " + score + " chance";
  if (nombreErreur >= 0) {
    erreur.textContent = "Il vous reste " + (4 - nombreErreur) + " tentative";
  }
}

function gestionActiviterButton(idButton, valeur) {
  document.getElementById(controleCaractere(idButton)).disabled = valeur;
  toucheUtiliser += controleCaractere(idButton);
}

function controleCaractere(valeur) {
  return (caractereSpecial.toUpperCase().indexOf(valeur.toUpperCase()) !== -1) ? caractereConvertie.at(caractereSpecial.toUpperCase().indexOf(valeur.toUpperCase())).toUpperCase() : valeur;
}
