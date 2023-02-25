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
    
    borrarHijos();

    if(ciudad == ""){
        alert("Introduce una ciudad");
        return;
    }

    fetch("https://geocoding-api.open-meteo.com/v1/search?name="+ciudad)
    .then(response => response.json())
    .then(data => respuesta(data));

}

function borrarHijos(){
    while(contenedor.hasChildNodes()){
        contenedor.removeChild(contenedor.firstChild);
    }
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
    if(!ciudad.hasOwnProperty('latitude') || !ciudad.hasOwnProperty('longitude') || !ciudad.hasOwnProperty('timezone')){
        ciudadErronea();
        return;
    }

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
    let repeticion = 0;
    dias.map(function(dia){
        const tarjeta = document.createElement("div");
        const lblDia = crearElementoLbl(dia);
        const contenedorTemperatura = crearElementoTemperatura(temperaturasMin[repeticion], temperaturasMax[repeticion]);
        const imagen = document.createElement("img");
        const lblLluvia = crearElementoLbl("Lluvia: " + lluvias[repeticion] + "mm");
        const lblViento = crearElementoLbl("Viento: " + vientos[repeticion] + "km/h");
        imagen.src = obtenerImagen(codigos[repeticion]);
        tarjeta.className = "tarjetasTiempo";
        tarjeta.appendChild(lblDia);
        tarjeta.appendChild(imagen);
        tarjeta.appendChild(contenedorTemperatura);
        tarjeta.appendChild(lblLluvia);
        tarjeta.appendChild(lblViento);
        contenedor.appendChild(tarjeta);
        repeticion++;
        
    })


}
function crearElementoLbl(texto){
    const lbl = document.createElement("label");
    lbl.innerHTML = texto;
    lbl.style.fontSize = '12px';
    return lbl;

}

function crearElementoTemperatura(tempMin, tempMax){
    const contenedor = document.createElement("div");
    const lblTemperaturaMax = document.createElement("label");
    const lblTemperaturaMin = document.createElement("label");
    lblTemperaturaMin.innerHTML = tempMin+ "° / "
    lblTemperaturaMin.style.color = 'blue';
    lblTemperaturaMax.innerHTML = tempMax+"°";
    lblTemperaturaMax.style.color = 'red';
    contenedor.appendChild(lblTemperaturaMin);
    contenedor.appendChild(lblTemperaturaMax);
    contenedor.style.marginBottom = '10px';
    return contenedor;
}

function obtenerImagen(codigo){
    switch(codigo){
        case 0: 
            return "./images/sun.png";
            break;
        case 1:
        case 2:
        case 3:
            return "./images/clouds.png";
            break;
        case 45:
        case 48:
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
            return "./images/rain.png";
            break;
        case 71:
        case 73:
        case 75:
        case 85:
        case 86:
        case 77:
            return "./images/snow.png";
            break;
        case 95:
        case 96:
        case 99:
            return "./images/thunderstorm.png";
            break;
        default:
            return "";
            break;
    }
}

function ciudadErronea(){

    const  textErroneo= document.createElement("label");
    textErroneo.style.color = 'red';
    textErroneo.innerHTML = "No se ha podido extraer el tiempo para esta ciudad";
    contenedor.appendChild(textErroneo);
    
}
