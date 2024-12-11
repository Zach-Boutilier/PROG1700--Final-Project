"use strict";

let countryName = "";
let countryInfos; 
let foundCountry;
let countryNameJ;
function parseCountryJSON(responseRaw) {
    let countryHtml = "";
    countryInfos = JSON.parse(responseRaw);

    for (let i = 0; i < countryInfos.length; i++) {
        let country1split = countryInfos[i].Name.split(" ");
        let country1join = country1split.join("_");

        countryHtml += `\n <option value="${country1join}" id="countryname-${countryInfos[i].Name}" countryFullName="${countryInfos[i].Name}">${countryInfos[i].Name}</option>`;
    }

    document.getElementById("countryNameList").innerHTML = countryHtml;
    return responseRaw;
}

function readTextFile(file) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == 200) {
            parseCountryJSON(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

readTextFile("countries.json");

document.getElementById("countryNameList").addEventListener('change', function () {
    countryName = document.getElementById("countryNameList").value;
    countryNameJ = DisplayCountryData();
    DisplayPopulationData();
    CalculateTotalWorldPopulation();
    CalculateArea();
});

function DisplayCountryData() {
    let countryNameHtml = "";
    let countryflagHtml = "";
    

    let countrysplit = countryName.split("_");
    let countryNameJ = countrysplit.join(' ');

    countryNameHtml = `<h1 id="infoinputs">Country Name: ${countryNameJ}</h1>`;
    countryflagHtml = `\n <img class="image" src="/flags/${countryName}.png" alt="${countryName} flag"><hr>`;

    document.getElementById("countryFlag").innerHTML = countryflagHtml;
    document.getElementById("countryName").innerHTML = countryNameHtml;
    document.getElementById("loadin1").innerHTML = '<div class="popbox"><div id="populationHtmldata"></div><div id="TotalWorldPopulationHtml"></div><div id="percentTotalHtml"></div></div>'
    document.getElementById("loadin2").innerHTML = '<label>Area in:</label><br><select class="boxes2" id="areaUnit" onchange="CalculateArea()"><option value="sqkm">Square Kilometers</option><option value="sqmiles">Square Miles</option></select><div id="areaHtmldata"></div><br>'
    document.getElementById("loadin3").innerHTML = '<div class="densebox"><input type="radio" name="measurementUnit" value="sqkm" id="radioKm" onchange="CalculatePopulationDensity()"><label for="radioKm">Square Kilometers</label><br><input type="radio" name="measurementUnit" value="sqmiles" id="radioMiles" onchange="CalculatePopulationDensity()"><label for="radioMiles">Square Miles</label><br><div id="densityHtmldata"></div></div>'
    document.getElementById("loadin4").innerHTML = '<button class="buttonwiki_cool" role="button" onclick="openWiki()"><span class="text">Open Wikipedia</span></button>'
    
    return(countryNameJ)
}

function DisplayPopulationData() 
{
    let populationData = "";

    let countrysplit = countryName.split("_");
    let countryNameJ = countrysplit.join(' ');

    let foundCountry = countryInfos.find(country => country.Name.toLowerCase() === countryNameJ.toLowerCase());

    populationData = `<p>Popultaion: ${foundCountry.Population}</p><hr>`;
    
    document.getElementById("populationHtmldata").innerHTML = populationData;
    return(foundCountry,populationData)
}

function CalculateTotalWorldPopulation()// Returns a float 
{
    let percentTotalWord = "";

    let totalWorldPopulation = 0;

    for (let i = 0; i < countryInfos.length; i++) {
        totalWorldPopulation += countryInfos[i].Population;
    }

    let totalWorldPopulationWord = `<p>The total world population is: ${totalWorldPopulation}</p><hr>`;

    foundCountry = countryInfos.find(country => country.Name.toLowerCase() === countryNameJ.toLowerCase());

    let percentTotal = (foundCountry.Population / totalWorldPopulation) * 100;
    percentTotalWord = `<p>${countryNameJ} is ${percentTotal.toFixed(2)}% of world population</p>`;
    
    document.getElementById("TotalWorldPopulationHtml").innerHTML = totalWorldPopulationWord;
    document.getElementById("percentTotalHtml").innerHTML = percentTotalWord;
    
}

function CalculateArea()// Returns a float 
{
    let areaHtml = "";
    let areaUnit = document.getElementById("areaUnit").value;

    let area = foundCountry.Area;

    if (areaUnit === "sqkm") {
        areaHtml = `<p class="boxes3">Area: ${area} square kilometers</p>`;
    } else if (areaUnit === "sqmiles") {
        // Convert square kilometers to square miles (1 sq km = 0.386102 sq miles)
        let areaInSqMiles = area * 0.386102;
        areaHtml = `<p class="boxes3">Area: ${areaInSqMiles.toFixed(2)} square miles</p>`;
    }

    document.getElementById("areaHtmldata").innerHTML = areaHtml;
}

function CalculatePopulationDensity() {
    let densityHtml = "";
    let popdensity = 0;

    let unit = document.querySelector('input[name="measurementUnit"]:checked').value;

    if (unit === "sqkm") {
        popdensity = foundCountry.Population / foundCountry.Area;
        densityHtml = `<p class="boxes4">Population Density: ${popdensity.toFixed(2)} people per square kilometer</p>`

    } else if (unit === "sqmiles") {
        // Correct the conversion factor to 0.239
        let convertmiles = foundCountry.Area * 0.239;
        popdensity = foundCountry.Population / convertmiles;
        densityHtml = `<p class="boxes4">Population Density: ${popdensity.toFixed(2)} people per square mile</p>`
    }
 
    document.getElementById("densityHtmldata").innerHTML = densityHtml;
}

function openWiki() {
    //selected country name
    countryName = document.getElementById("countryNameList").value;

    //Wiki URL based on the country name
    let wikiURL = `https://en.wikipedia.org/wiki/${countryName}`;

    //Open the Wiki in new tab.
    window.open(wikiURL, '_blank');
}