const RARITIES = {
  "Common": {weight: 49.0, color: "#9aa0a6", items: {"Melody":50,"Healing":50}},
  "Uncommon": {weight: 32.0, color: "#34a853", items: {"Earth":43,"Wind":57}},
  "Rare": {weight: 16.0, color: "#4285f4", items: {"Slime":68,"Dice":32}},
  "Epic": {weight: 2.0, color: "#a142f4", items: {"Love":9,"Poison":18,"Flame":36,"Lightning":36}},
  "Legendary": {weight: 0.49, color: "#fbbc05", items: {"Water":31,"Void":29,"Ice":17,"Spatial":6,"Sand":6}},
  "Mythic": {weight: 0.14, color: "#ff7043", items: {"Light":4,"Balance":8,"Time":18,"Blood":35,"World Tree":35}},
  "Divine": {weight: 0.03, color: "#ff5252", items: {"Dark Magic":100}}
};

let totalSpins = 0;
let countsPerRarity = {};
for (let r in RARITIES) countsPerRarity[r] = 0;

const resultColor = document.getElementById("result-color");
const resultText = document.getElementById("result-text");
const countersDiv = document.getElementById("counters");
const historyList = document.getElementById("history");
const spinBtn = document.getElementById("spin-btn");
const bulkBtn = document.getElementById("bulk-btn");
const bulkEntry = document.getElementById("bulk-entry");
const clearBtn = document.getElementById("clear-btn");

function weightedChoice(mapping) {
  const keys = Object.keys(mapping);
  const weights = Object.values(mapping);
  const sum = weights.reduce((a,b)=>a+b,0);
  let rnd = Math.random() * sum;
  for (let i=0;i<keys.length;i++){
    if (rnd < weights[i]) return keys[i];
    rnd -= weights[i];
  }
}

function pickRarityAndItem() {
  const rarity = weightedChoice(Object.fromEntries(Object.entries(RARITIES).map(([k,v])=>[k,v.weight])));
  const item = weightedChoice(RARITIES[rarity].items);
  return {rarity, item};
}

function updateUI(rarity, item, historyOnly=false){
  totalSpins++;
  countsPerRarity[rarity]++;
  
  resultColor.style.backgroundColor = RARITIES[rarity].color;
  resultText.textContent = `${item} — ${rarity}`;
  
  countersDiv.innerHTML = "";
  for (let r in countsPerRarity){
    const div = document.createElement("div");
    div.textContent = `${r}: ${countsPerRarity[r]}`;
    div.style.color = RARITIES[r].color;
    div.className = "counter-item";
    countersDiv.appendChild(div);
  }
  
  const li = document.createElement("li");
  li.textContent = `${item} [${rarity}]`;
  historyList.prepend(li);
  if (historyList.children.length > 1000) historyList.removeChild(historyList.lastChild);
  
  if (historyOnly) return;
}

spinBtn.onclick = ()=> {
  const {rarity, item} = pickRarityAndItem();
  updateUI(rarity, item);
}

bulkBtn.onclick = ()=> {
  let n = parseInt(bulkEntry.value) || 1;
  if (n <=0) n = 1;
  for (let i=0;i<n;i++){
    const {rarity, item} = pickRarityAndItem();
    updateUI(rarity, item, i<n-1);
  }
}

clearBtn.onclick = ()=> {
  totalSpins = 0;
  for (let r in countsPerRarity) countsPerRarity[r]=0;
  resultColor.style.backgroundColor = "#12151c";
  resultText.textContent = "—";
  countersDiv.innerHTML = "";
  historyList.innerHTML = "";
}
