/*
La API es https://open-meteo.com/en/docs

Primero debemos hacer una petición para extraer la latitud, longitud y zona horaria de la ciudad que queremos buscar

var city = ...
var CITY_API_URL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

Con esa información, haremos una segunda petición que nos devolverá la predicción

var lat = ...
var lon = ...
var timezone = ...
var WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min,rain_sum,windspeed_10m_max`;
*/

let contenedor = document.getElementById("contenedorTiempo");

function buscarTiempo(){
    var ciudad = document.getElementById("ciudadBuscar").value;
    
    if(ciudad == ""){
        alert("Introduce una ciudad");
        return;
    }

    while(contenedor.hasChildNodes()){
        contenedor.removeChild(contenedor.firstChild);
    }

    fetch("https://geocoding-api.open-meteo.com/v1/search?name="+ciudad)
    .then(response => response.json())
    .then(data => respuesta(data));

}

function respuesta(respuesta){

    if(respuesta.hasOwnProperty('results')){
        obtenerRespuesta(respuesta);
    }
    else{
        ciudadErronea();
    }

}

function obtenerRespuesta(respuesta){
    
    let ciudad = respuesta.results[0];
    let url = "https://api.open-meteo.com/v1/forecast?latitude="+ciudad.latitude+"&longitude="+ciudad.longitude+"&timezone="+ciudad.timezone+"&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,windspeed_10m_max,winddirection_10m_dominant"
    fetch(url).then(response => response.json())
    .then(result => mostrarRespuesta (result));

}

function mostrarRespuesta(resultado){
    let dias = resultado.daily.time;
    let codigos = resultado.daily.weathercode;
    let temperaturasMax = resultado.daily.temperature_2m_max;
    let temperaturasMin = resultado.daily.temperature_2m_min;
    let lluvias = resultado.daily.precipitation_sum;
    let vientos = resultado.daily.windspeed_10m_max;

    console.log(codigos);
    console.log(temperaturasMin);
    console.log(lluvias);

}

function ciudadErronea(){
    const  textErroneo= document.createElement("label");
    textErroneo.style.color = 'red';
    textErroneo.innerHTML = "No se ha podido extraer el tiempo para esta ciudad";
    contenedor.appendChild(textErroneo);
    
}
