var chaosIcon = '';
var exaltPrice = 60;
var exaltIcon = '';
var currentMax = 1;
var league = 'tmphardcore';
var tempRates;

function updateRates(){
  var result;

  console.log('I\'m updating the rates!');
  dataSent = {
    mode: "cors", // no-cors, cors, *same-origin
    headers: {
            "Content-Type": "application/json; charset=utf-8",
            "X-Requested-With": "XMLHttpRequest"
             }}

  fetch(`https://cors-anywhere.herokuapp.com/https://poe.ninja/api/Data/GetCurrencyOverview?league=${league}`, dataSent)
    .then(response => response.json())
    .then(data => result = data)
    .then(() => {
      console.log('We have data:',result)
      tempRates = parse(result);
      clearChart();
      renderGraphs(tempRates);
    })
    .catch(err => {
      console.log("League:",league);
      console.log("It didn't work...", err);
    });
    return result;
}

function findNearestWholeTrade(itemChaosEquiv) {
  // In order to trade in whole numbers closest to the actual rate, find the nearest whole number
  // Example: Fusing at 1.75:1 chaos can instead be traded as 7 fusing for 4 chaos
  var product = 0, multiplier = 1;
  product += itemChaosEquiv;
  while(product.toFixed(1) % 1 !== 0){
    product += itemChaosEquiv;
    multiplier++;
  }
  product = Math.round(product);
  return [product, multiplier];
}

function parse(data){
  chaosIcon = data.currencyDetails[0].icon;
  exaltIcon = data.currencyDetails[1].icon;
  exaltPrice = data.lines[2].chaosEquivalent;

  let result = [
    { name: 'Gemcutter\'s Prism' },
    { name: 'Vaal Orb' },
    { name: 'Orb of Regret' },
    { name: 'Orb of Fusing' },
    { name: 'Orb of Scouring' },
    { name: 'Blessed Orb' },
    { name: 'Orb of Alchemy' },
    { name: 'Cartographer\'s Chisel' },
    { name: 'Glassblower\'s Bauble' },
    { name: 'Splinter of Xoph' },
    { name: 'Silver Coin' },
    { name: 'Orb of Binding' },
    { name: 'Jeweller\'s Orb' },
    { name: 'Splinter of Uul-Netol' },
    { name: 'Orb of Alteration' },
    { name: 'Chromatic Orb' },
    { name: 'Orb of Chance' },
    { name: 'Splinter of Esh' },
    { name: 'Splinter of Tul' },
    { name: 'Orb of Augmentation' },
    { name: 'Orb of Transmutation' },
    { name: 'Blacksmith\'s Whetstone' },
    { name: 'Portal Scroll' },
    { name: 'Armourer\'s Scrap' },
];
for (let item of result){ // Pulls data into the array of objects above
  // The index values are inconsistent from the API, so we utilize findIndex and match name strings

  item.chaosEquivalent = data.lines[data.lines.findIndex(function(currency) {return currency.currencyTypeName === item.name })].chaosEquivalent;
  item.icon = data.currencyDetails[data.currencyDetails.findIndex(function(currency){ return currency.name === item.name })].icon;
  currentMax = (item.chaosEquivalent > currentMax) ? item.chaosEquivalent : currentMax;
}
  // Since Chaos Orb is not a part of the data set, we have to manually add it
  result.unshift({ name: 'Chaos Orb',
                   chaosEquivalent: 1,
                   icon: chaosIcon});
  return result;
}

function removeBarItem(index){
  console.log(`removing ${tempRates[index].name}`);
  tempRates.splice(index,1);
  let equivs = tempRates.map(item => item.chaosEquivalent);
  currentMax = Math.max(...equivs);
//  for(let item of tempRates) { if(item.chaosEquivalent > currentMax) currentMax = item.chaosEquivalent; }
  console.log('New currentMax',currentMax);
  clearChart();
  renderGraphs(tempRates);
}

function renderGraphs(rates){
  console.log('rendering rates:',rates);
  let chart = document.getElementById("chart");
  let itemIndex = 0;
  for (var item of rates){
    let unspacedName = item.name.replace(/\'/g,'').replace(/\s/g,'');
    let chaosEquiv = item.chaosEquivalent;
    let barItem = document.createElement("div");
    let itemInfo = document.createElement("div");
    let deleteButton = document.createElement("button");
    let worth = (1 / chaosEquiv).toFixed(2);
    worth = (worth % 1 === 0) ? parseFloat(worth).toFixed(0) : worth; //Remove decimals when not necessary e.g. 10.00
    let height = scaleRange(chaosEquiv);
    let nearestWholeTrade = findNearestWholeTrade(parseFloat(worth));
    deleteButton.innerHTML = "Remove";
    deleteButton.id = itemIndex;
    deleteButton.onclick = function(event){
      console.log('buttonclicked, deleting',event.target.id);
      removeBarItem(event.target.id);
    };
    itemInfo.innerHTML = `
    <div class="infoline">${nearestWholeTrade[1]} <img src="${chaosIcon}" width="32" height="32"> = ${nearestWholeTrade[0]} <img src="${item.icon}" width="32" height="32"></div> <br>
    <div class="infoline">10 <img src="${chaosIcon}" width="32" height="32"> = ${Math.round(10 / chaosEquiv)} <img src="${item.icon}" width="32" height="32"></div> <br>
    <div class="infoline">1&nbsp;&nbsp; <img src="${exaltIcon}" width="32" height="32"> = ${Math.round(exaltPrice * worth)} <img src="${item.icon}" width="32" height="32"></div>
    `;

    itemInfo.id = unspacedName + "-info";
    itemInfo.classList.add('hidden');
    itemInfo.appendChild(deleteButton);
    (height > 10) ? barItem.classList.add("BarGraph-bar") : barItem.classList.add("BarGraph-bar-small");

    barItem.onmouseover = function(){ document.getElementById(unspacedName+'-info').classList.remove('hidden');};
    barItem.onmouseleave = function(){ document.getElementById(unspacedName+'-info').classList.add('hidden');};

    barItem.textContent = item.name + '\r\n' + worth +':1c';
    barItem.appendChild(document.createElement("br"));
    barItem.style.height = height + "%";

    let barImage = document.createElement("img");
    barImage.src = item.icon;
    barItem.appendChild(barImage);
    barItem.appendChild(itemInfo);

    //console.log(item.name + "is worth " + worth + "| chaos equiv: " + chaosEquiv + "height: " + barItem.style.height);
    chart.appendChild(barItem);
    itemIndex++;
  }

}

function switchLeague(){
  currentMax = 1;
  let title = document.getElementById("league-title");
  let selectBox = document.getElementById("league");
  league = selectBox.options[selectBox.selectedIndex].value;
  let leagueTitle = selectBox.options[selectBox.selectedIndex].textContent;
  console.log("League",league);
  title.innerHTML = `Path of Exile Currency Rates in ${leagueTitle}`;
  clearChart();
  updateRates();
}
/* TODO: Sort greatest to least
function sort(){
  let bars = document.querySelectorAll("BarGraph-bar");
  let currentMax = 0;
  for(let bar of bars){

  }
}*/
function scaleRange(value) { //Scales Number in Range r1 to Number in Range r2
    let r1 = [0, currentMax];
    let r2 = [0, 100];
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}



function clearChart(){
  console.log('clearChart is being called');
  let chart = document.getElementById("chart");
  while(chart.firstChild){
    chart.removeChild(chart.firstChild);
  }
  /*
  let bar = document.createElement("div");

  let chaosimage = document.createElement('img');
  chaosimage.id = "chaosIcon";
  chaosimage.src = chaosIcon;
  bar.classList.add("BarGraph-bar");

// To add delete button to chaos orb, remove most of this code and make Chaos Orb a part of the object array like everything else

  bar.id = "chaosBar";
  bar.style.height = chaosHeight+"%";
  bar.innerHTML = "1x<br>Chaos Orb<br>";

  let itemInfo = document.createElement("div");
  itemInfo.classList.add('info');
  itemInfo.id = "Chaos-info";
  itemInfo.classList.add('hidden');
  itemInfo.innerHTML = `
  <div class="infoline">1&nbsp;&nbsp; <img src="${exaltIcon}" width="32" height="32"> = ${exaltPrice} <img src="${chaosIcon}" width="32" height="32"></div>
  `;

  bar.onmouseover = function(){ document.getElementById('Chaos-info').classList.remove('hidden');};
  bar.onmouseleave = function(){ document.getElementById('Chaos-info').classList.add('hidden');};

  bar.appendChild(chaosimage);
  bar.appendChild(itemInfo);
  chart.appendChild(bar);*/
}
