// ===== STATE =====

let hunting = false;
let interval = null;
let currentPokemonId = null;

let hunts = JSON.parse(localStorage.getItem("hunts")) || {};
let currentHunt = null;

let shinyCollection = JSON.parse(localStorage.getItem("shinies")) || [];

// ===== INIT =====

window.onload = () => {

renderCollection();
renderHuntList();

};

// ===== START HUNT =====

async function startHunt(){

stopHunt();

const nameInput = document.getElementById("pokemonName").value.toLowerCase();

if(!nameInput){
alert("Enter a Pokémon name");
return;
}

const game = document.getElementById("game").value;

if(!hunts[nameInput]){

hunts[nameInput] = {
encounters:0,
game:game
};

}

currentHunt = nameInput;

await fetchPokemon(nameInput);

updateCounter();

renderHuntList();

saveData();

hunting = true;

interval = setInterval(encounter,8000);

}

// ===== LOAD EXISTING HUNT =====

async function loadHunt(name){

stopHunt();

currentHunt = name;

document.getElementById("pokemonName").value = name;

await fetchPokemon(name);

updateCounter();

}

// ===== STOP =====

function stopHunt(){

hunting = false;
clearInterval(interval);

}

// ===== MANUAL ENCOUNTER =====

function manualEncounter(){

if(!currentHunt) return;

encounter();

}

// ===== FETCH POKEMON =====

async function fetchPokemon(name){

try{

const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

const data = await res.json();

currentPokemonId = data.id;

document.getElementById("sprite").src =
`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;

}catch{

alert("Pokémon not found");

}

}

// ===== ENCOUNTER =====

function encounter(){

if(!currentHunt) return;

hunts[currentHunt].encounters++;

updateCounter();

if(rollShiny()){

stopHunt();

const name = currentHunt;

document.getElementById("sprite").src =
`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${currentPokemonId}.png`;

playEffects();

const shinyData = {

name:name,
encounters:hunts[currentHunt].encounters,
game:hunts[currentHunt].game,
date:new Date().toLocaleDateString()

};

shinyCollection.push(shinyData);

hunts[currentHunt].encounters = 0;

document.getElementById("result").innerText =
`✨ SHINY ${name.toUpperCase()} FOUND!`;

saveData();

renderCollection();
renderHuntList();

}

saveData();

}

// ===== ODDS =====

function rollShiny(){

const game = document.getElementById("game").value;

const charm = document.getElementById("shinyCharm").checked;

let odds = 4096;

if(["gen1","gen2","gen3","gen4"].includes(game)){
odds = 8192;
}

if(game === "gen5" && charm){
odds = 1365;
}

return Math.random() < 1/odds;

}

// ===== COUNTER =====

function updateCounter(){

if(!currentHunt) return;

document.getElementById("counter").innerText =
`Encounters: ${hunts[currentHunt].encounters}`;

}

// ===== HUNT LIST =====

function renderHuntList(){

const container = document.getElementById("huntList");

container.innerHTML = "";

Object.keys(hunts).forEach(name=>{

const div = document.createElement("div");

div.classList.add("hunt-card");

div.innerHTML = `
<div class="hunt-name">${name.toUpperCase()}</div>
<div class="hunt-count">${hunts[name].encounters} encounters</div>
`;

div.onclick = ()=> loadHunt(name);

container.appendChild(div);

});

}

// ===== COLLECTION =====

function renderCollection(){

const container = document.getElementById("collection");

container.innerHTML = "";

shinyCollection.forEach(s=>{

const div = document.createElement("div");

div.classList.add("hunt-card");

div.innerText =
`${s.name.toUpperCase()} | ${s.encounters} encounters | ${s.game}`;

container.appendChild(div);

});

}

// ===== SAVE =====

function saveData(){

localStorage.setItem("hunts",JSON.stringify(hunts));

localStorage.setItem("shinies",JSON.stringify(shinyCollection));

}

// ===== EFFECTS =====

function playEffects(){

const sound = document.getElementById("shinySound");

sound.currentTime = 0;

sound.play();

const flash = document.getElementById("flash");

flash.style.opacity = "1";

setTimeout(()=>flash.style.opacity="0",150);

createSparkles();

}

function createSparkles(){

const sprite = document.getElementById("sprite");

const rect = sprite.getBoundingClientRect();

for(let i=0;i<20;i++){

const s = document.createElement("div");

s.classList.add("sparkle");

s.style.left = rect.left + rect.width/2 + "px";
s.style.top = rect.top + rect.height/2 + "px";

s.style.setProperty("--x",(Math.random()-0.5)*200+"px");
s.style.setProperty("--y",(Math.random()-0.5)*200+"px");

document.body.appendChild(s);

setTimeout(()=>s.remove(),1000);

}

}

// ===== EXPORT SAVE =====

function exportSave(){

const data = {

hunts: hunts,
shinies: shinyCollection

};

const json = JSON.stringify(data,null,2);

const blob = new Blob([json], {type:"application/json"});

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;
a.download = "shiny-hunt-save.json";

a.click();

URL.revokeObjectURL(url);

}

// ===== IMPORT SAVE =====

function importSave(){

const fileInput = document.getElementById("importFile");

const file = fileInput.files[0];

if(!file){

alert("Select a save file first");

return;

}

const reader = new FileReader();

reader.onload = function(event){

try{

const data = JSON.parse(event.target.result);

hunts = data.hunts || {};
shinyCollection = data.shinies || [];

saveData();

renderCollection();
renderHuntList();

alert("Save imported successfully!");

}catch{

alert("Invalid save file");

}

};

reader.readAsText(file);

}   