/* =========================================
   Korea 2026 Travel Website Functions
   ========================================= */


/* ---------- Countdown ---------- */

const departureDate = new Date("September 24, 2026 00:00:00").getTime();


function updateCountdown(){

    const now = new Date().getTime();

    const difference = departureDate - now;


    if(difference < 0){

        document.getElementById("countdownTimer").innerHTML =
        "The adventure has begun! 🇰🇷";

        return;

    }


    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );


    const hours = Math.floor(
        (difference % (1000*60*60*24)) /
        (1000*60*60)
    );


    const minutes = Math.floor(
        (difference % (1000*60*60)) /
        (1000*60)
    );


    document.getElementById("countdownTimer").innerHTML =
    `${days} days ${hours} hours ${minutes} minutes`;

}


setInterval(updateCountdown,1000);

updateCountdown();





/* ---------- Itinerary Data ---------- */


const itinerary = [


{
date:"24 September",
city:"Seoul",
title:"Arrival in Seoul 🇰🇷",
activities:[
"Airport arrival",
"Check into accommodation",
"Explore nearby neighbourhood"
]
},


{
date:"25 September",
city:"Seoul",
title:"Seoul Exploration",
activities:[
"Add activities here",
"Add restaurant ideas here"
]
},


{
date:"26 September",
city:"Seoul",
title:"Culture & Food Day",
activities:[
"Add palace visits",
"Museums",
"Cafés"
]
},


{
date:"27 September",
city:"Seoul",
title:"Seoul Adventures",
activities:[
"Shopping",
"Markets",
"Local experiences"
]
},


{
date:"28 September",
city:"Seoul",
title:"Final Seoul Day",
activities:[
"Last shopping",
"Favourite cafés"
]
},


{
date:"29 September",
city:"Jeju",
title:"Travel to Jeju 🌊",
activities:[
"Fly to Jeju",
"Check in",
"Explore island"
]
},


{
date:"30 September",
city:"Jeju",
title:"Jeju Island",
activities:[
"Nature",
"Beaches",
"Food"
]
},


{
date:"1 October",
city:"Jeju",
title:"Jeju Island",
activities:[
"Add activities here"
]
},


{
date:"2 October",
city:"Jeju",
title:"Final Jeju Day",
activities:[
"Relax",
"Explore"
]
},


{
date:"3 October",
city:"Gyeongju",
title:"Historic Gyeongju 🏯",
activities:[
"Travel to Gyeongju",
"Explore historic sites"
]
},


{
date:"4 October",
city:"Gyeongju",
title:"Ancient Korea",
activities:[
"Bulguksa Temple",
"Historic areas"
]
},


{
date:"5 October",
city:"Gyeongju",
title:"Gyeongju Exploration",
activities:[
"Add activities here"
]
},


{
date:"6 October",
city:"Gyeongju",
title:"Final Gyeongju Day",
activities:[
"Add activities here"
]
},


{
date:"7 October",
city:"Jeonju",
title:"Jeonju Hanok Village 🍂",
activities:[
"Travel to Jeonju",
"Explore Hanok Village"
]
},


{
date:"8 October",
city:"Jeonju",
title:"Jeonju Food Day",
activities:[
"Bibimbap",
"Markets",
"Cafés"
]
},


{
date:"9 October",
city:"Jeonju",
title:"Final Day",
activities:[
"Final sightseeing",
"Prepare for departure"
]
},


{
date:"10 October",
city:"Jeonju",
title:"Departure ✈️",
activities:[
"Travel home"
]
}


];





/* ---------- Generate Itinerary ---------- */


const itineraryContainer =
document.getElementById("itineraryContainer");


itinerary.forEach(day => {


const card =
document.createElement("div");


card.className =
"card itinerary-card";



card.innerHTML = `

<div class="itinerary-header">

<h3>
${day.date} - ${day.city}
</h3>

<span>▼</span>

</div>


<div class="itinerary-content">

<h4>${day.title}</h4>


<ul>

${day.activities
.map(item=>`<li>${item}</li>`)
.join("")}

</ul>


<a 
class="map-button"
target="_blank"
href="https://www.google.com/maps/search/${encodeURIComponent(day.city)}"
>
📍 Google Maps
</a>


<a 
class="map-button"
target="_blank"
href="https://map.naver.com/v5/search/${encodeURIComponent(day.city)}"
>
📍 Naver Maps
</a>


</div>

`;



card.querySelector(".itinerary-header")
.addEventListener("click",()=>{

card.querySelector(".itinerary-content")
.classList.toggle("active");

});


itineraryContainer.appendChild(card);


});







/* ---------- Currency Converter KRW → AUD ---------- */

// Approximate exchange rate
// Update before travelling
const krwToAudRate = 0.0011;

const krwInput = document.getElementById("krwInput");

krwInput.addEventListener("input", () => {

    const krwAmount = Number(krwInput.value);

    const audAmount = krwAmount * krwToAudRate;

    document.getElementById("audOutput").innerHTML =
        "$" + audAmount.toFixed(2) + " AUD";
  
   document.getElementById("exchangeRate").textContent =
    `Approximate rate: ₩1,000 ≈ $${(1000 * krwToAudRate).toFixed(2)} AUD`;

});



/* ---------- Dark Mode ---------- */


const themeButton =
document.getElementById("themeToggle");


themeButton.onclick = ()=>{

document.body.classList.toggle("dark");


const darkModeEnabled =
document.body.classList.contains("dark");


// Save preference
localStorage.setItem(
"theme",
darkModeEnabled ? "dark" : "light"
);


themeButton.innerHTML =
document.body.classList.contains("dark")
?
"☀️ Light Mode"
:
"🌚 Dark Mode";

};

// Load saved theme preference

const savedTheme =
localStorage.getItem("theme");


if(savedTheme === "dark"){

    document.body.classList.add("dark");

    themeButton.innerHTML =
    "☀️ Light Mode";

}
/* =========================================
   Weather + Air Quality + Humidity
   ========================================= */


const locations = {

    seoulWeather:{
        latitude:37.5665,
        longitude:126.9780
    },

    jejuWeather:{
        latitude:33.4996,
        longitude:126.5312
    },

    gyeongjuWeather:{
        latitude:35.8562,
        longitude:129.2247
    },

    jeonjuWeather:{
        latitude:35.8242,
        longitude:127.1480
    }

};



function airQualityLabel(pm){

    if(pm <= 12){
        return "🟢 Good";
    }

    else if(pm <= 35){
        return "🟡 Moderate";
    }

    else if(pm <= 55){
        return "🟠 Unhealthy";
    }

    else{
        return "🔴 Poor";
    }

}




async function getWeather(){


for(const id in locations){


const location = locations[id];


try {


const weatherResponse = await fetch(

`https://api.open-meteo.com/v1/forecast?
latitude=${location.latitude}
&longitude=${location.longitude}
&current=
temperature_2m,
relative_humidity_2m`

.replace(/\s/g,'')

);



const weatherData =
await weatherResponse.json();



const airResponse = await fetch(

`https://air-quality-api.open-meteo.com/v1/air-quality?
latitude=${location.latitude}
&longitude=${location.longitude}
&current=pm2_5`

.replace(/\s/g,'')

);



const airData =
await airResponse.json();



const temperature =
weatherData.current.temperature_2m;



const humidity =
weatherData.current.relative_humidity_2m;



const pm =
airData.current.pm2_5;



document.getElementById(id).innerHTML =

`

🌡️ Temperature:
<strong>${temperature}°C</strong>

<br><br>

🌫️ Air Quality:
<strong>${airQualityLabel(pm)}</strong>

<br>

PM2.5:
<strong>${pm} μg/m³</strong>

<br><br>

💧 Humidity:
<strong>${humidity}%</strong>

`;



}


catch(error){

document.getElementById(id).innerHTML =
"Weather unavailable";

}


}


}


getWeather();
