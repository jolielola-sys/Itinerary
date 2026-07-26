"use strict";

/* =========================================
   Korea 2026 Travel Website
   script.js — Part 1 of 4
   ========================================= */


/* =========================================
   General helper functions
   ========================================= */

/**
 * Safely updates the text inside an element.
 *
 * @param {string} elementId
 * @param {string} text
 */
function setElementText(elementId, text) {

    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = text;
    }

}


/**
 * Escapes text before inserting it into generated HTML.
 *
 * @param {unknown} value
 * @returns {string}
 */
function escapeHTML(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================
   Countdown
   ========================================= */

const departureDate =
    new Date("2026-09-24T00:00:00+10:00");


function updateCountdown() {

    const countdownElement =
        document.getElementById("countdownTimer");

    if (!countdownElement) {
        return;
    }


    const now = new Date();

    const difference =
        departureDate.getTime() - now.getTime();


    if (difference <= 0) {

        countdownElement.textContent =
            "The adventure has begun! 🇰🇷";

        return;

    }


    const totalSeconds =
        Math.floor(difference / 1000);

    const days =
        Math.floor(totalSeconds / 86400);

    const hours =
        Math.floor((totalSeconds % 86400) / 3600);

    const minutes =
        Math.floor((totalSeconds % 3600) / 60);

    const seconds =
        totalSeconds % 60;


    countdownElement.textContent =
        `${days} days ${hours} hours ` +
        `${minutes} minutes ${seconds} seconds`;

}


updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================================
   Dark mode
   ========================================= */

const themeButton =
    document.getElementById("themeToggle");


function updateThemeButton() {

    if (!themeButton) {
        return;
    }


    const darkModeEnabled =
        document.body.classList.contains("dark");


    themeButton.innerHTML =
        darkModeEnabled
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";


    themeButton.setAttribute(
        "aria-pressed",
        String(darkModeEnabled)
    );

}


/*
Load the theme saved in this browser.
*/
const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

}


updateThemeButton();


if (themeButton) {

    themeButton.addEventListener("click", () => {

        document.body.classList.toggle("dark");


        const darkModeEnabled =
            document.body.classList.contains("dark");


        localStorage.setItem(
            "theme",
            darkModeEnabled ? "dark" : "light"
        );


        updateThemeButton();

    });

}


/* =========================================
   Static KRW → AUD currency converter
   ========================================= */

/*
Update this number closer to departure.

0.0011 means:
₩1 KRW ≈ $0.0011 AUD
₩1,000 KRW ≈ $1.10 AUD
*/
const krwToAudRate = 0.0011;


const krwInput =
    document.getElementById("krwInput");

const audOutput =
    document.getElementById("audOutput");

const exchangeRateDisplay =
    document.getElementById("exchangeRate");


function formatAUD(amount) {

    return new Intl.NumberFormat("en-AU", {

        style: "currency",

        currency: "AUD",

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    }).format(amount);

}


function updateDisplayedExchangeRate() {

    if (!exchangeRateDisplay) {
        return;
    }


    const amountForOneThousandWon =
        1000 * krwToAudRate;


    exchangeRateDisplay.textContent =
        `₩1,000 ≈ ${formatAUD(amountForOneThousandWon)} AUD`;

}


function convertKRWToAUD() {

    if (!krwInput || !audOutput) {
        return;
    }


    const krwAmount =
        Number(krwInput.value);


    if (
        krwInput.value.trim() === "" ||
        !Number.isFinite(krwAmount) ||
        krwAmount < 0
    ) {

        audOutput.textContent =
            "$0.00 AUD";

        return;

    }


    const audAmount =
        krwAmount * krwToAudRate;


    audOutput.textContent =
        `${formatAUD(audAmount)} AUD`;

}


updateDisplayedExchangeRate();

convertKRWToAUD();


if (krwInput) {

    krwInput.addEventListener(
        "input",
        convertKRWToAUD
    );

}


/* =========================================
   Weather and air-quality locations
   ========================================= */

const weatherLocations = {

    seoulWeather: {

        name: "Seoul",

        latitude: 37.5665,

        longitude: 126.9780

    },

    jejuWeather: {

        name: "Jeju",

        latitude: 33.4996,

        longitude: 126.5312

    },

    gyeongjuWeather: {

        name: "Gyeongju",

        latitude: 35.8562,

        longitude: 129.2247

    },

    jeonjuWeather: {

        name: "Jeonju",

        latitude: 35.8242,

        longitude: 127.1480

    }

};


/**
 * Returns a simple label based on PM2.5.
 *
 * These categories are intended as a quick travel guide,
 * rather than a formal health advisory.
 *
 * @param {number} pm25
 * @returns {string}
 */
function getAirQualityLabel(pm25) {

    if (!Number.isFinite(pm25)) {
        return "Unavailable";
    }


    if (pm25 <= 12) {
        return "🟢 Good";
    }


    if (pm25 <= 35) {
        return "🟡 Moderate";
    }


    if (pm25 <= 55) {
        return "🟠 Unhealthy";
    }


    return "🔴 Poor";

}


/**
 * Fetches current weather and air-quality data for one city.
 *
 * @param {object} location
 * @returns {Promise<object>}
 */
async function fetchLocationConditions(location) {

    const weatherParameters =
        new URLSearchParams({

            latitude:
                String(location.latitude),

            longitude:
                String(location.longitude),

            current:
                "temperature_2m,relative_humidity_2m",

            timezone:
                "auto"

        });


    const airQualityParameters =
        new URLSearchParams({

            latitude:
                String(location.latitude),

            longitude:
                String(location.longitude),

            current:
                "pm2_5",

            timezone:
                "auto"

        });


    const weatherURL =
        "https://api.open-meteo.com/v1/forecast?" +
        weatherParameters.toString();


    const airQualityURL =
        "https://air-quality-api.open-meteo.com/v1/air-quality?" +
        airQualityParameters.toString();


    const [
        weatherResponse,
        airQualityResponse
    ] = await Promise.all([

        fetch(weatherURL),

        fetch(airQualityURL)

    ]);


    if (!weatherResponse.ok) {

        throw new Error(
            `Weather request failed with status ` +
            `${weatherResponse.status}.`
        );

    }


    if (!airQualityResponse.ok) {

        throw new Error(
            `Air-quality request failed with status ` +
            `${airQualityResponse.status}.`
        );

    }


    const weatherData =
        await weatherResponse.json();

    const airQualityData =
        await airQualityResponse.json();


    return {

        temperature:
            weatherData.current?.temperature_2m,

        humidity:
            weatherData.current?.relative_humidity_2m,

        pm25:
            airQualityData.current?.pm2_5

    };

}


/**
 * Displays weather data inside one weather card.
 *
 * @param {string} elementId
 * @param {object} conditions
 */
function displayLocationConditions(
    elementId,
    conditions
) {

    const element =
        document.getElementById(elementId);


    if (!element) {
        return;
    }


    const temperature =
        Number(conditions.temperature);

    const humidity =
        Number(conditions.humidity);

    const pm25 =
        Number(conditions.pm25);


    const temperatureText =
        Number.isFinite(temperature)
            ? `${temperature.toFixed(1)}°C`
            : "Unavailable";


    const humidityText =
        Number.isFinite(humidity)
            ? `${Math.round(humidity)}%`
            : "Unavailable";


    const pm25Text =
        Number.isFinite(pm25)
            ? `${pm25.toFixed(1)} μg/m³`
            : "Unavailable";


    element.innerHTML = `

        <span class="weather-item">

            <span class="weather-label">
                🌡️ Temperature
            </span>

            <strong>
                ${escapeHTML(temperatureText)}
            </strong>

        </span>


        <span class="weather-item">

            <span class="weather-label">
                🌫️ Air Quality
            </span>

            <strong>
                ${escapeHTML(getAirQualityLabel(pm25))}
            </strong>

            <small>
                PM2.5: ${escapeHTML(pm25Text)}
            </small>

        </span>


        <span class="weather-item">

            <span class="weather-label">
                💧 Humidity
            </span>

            <strong>
                ${escapeHTML(humidityText)}
            </strong>

        </span>

    `;

}


/**
 * Loads conditions for all four destinations.
 */
async function loadAllWeather() {

    const locationEntries =
        Object.entries(weatherLocations);


    await Promise.all(

        locationEntries.map(
            async ([elementId, location]) => {

                const element =
                    document.getElementById(elementId);


                if (!element) {
                    return;
                }


                element.textContent =
                    "Loading current conditions…";


                try {

                    const conditions =
                        await fetchLocationConditions(
                            location
                        );


                    displayLocationConditions(
                        elementId,
                        conditions
                    );

                } catch (error) {

                    console.error(
                        `Unable to load conditions for ` +
                        `${location.name}:`,
                        error
                    );


                    element.innerHTML = `

                        <span class="weather-error">

                            Current conditions are unavailable.

                        </span>

                    `;

                }

            }
        )

    );

}


loadAllWeather();
/* =========================================
   Travel timeline data
   ========================================= */

const travelItinerary = [

    {
        date: "24 September",
        isoDate: "2026-09-24",

        icon: "✈️",

        title: "Brisbane → Seoul",

        description:
            "Fly to Seoul and check in to our first accommodation."
    },

    {
        date: "29 September",
        isoDate: "2026-09-29",

        icon: "✈️",

        title: "Seoul → Jeju",

        description:
            "Fly to Jeju Island and check in to our accommodation."
    },

    {
        date: "3 October",
        isoDate: "2026-10-03",

        icon: "✈️",

        title: "Jeju → Gyeongju",

        description:
            "Travel from Jeju to Gyeongju and check in."
    },

    {
        date: "7 October",
        isoDate: "2026-10-07",

        icon: "🚆",

        title: "Gyeongju → Jeonju",

        description:
            "Travel from Gyeongju to Jeonju and check in."
    },

    {
        date: "10 October",
        isoDate: "2026-10-10",

        icon: "🏠",

        title: "Return Home",

        description:
            "Begin the journey home to Brisbane."
    }

];


/* =========================================
   Generate travel timeline
   ========================================= */

const itineraryContainer =
    document.getElementById("itineraryContainer");


/**
 * Converts a YYYY-MM-DD date into a local Date object.
 *
 * Using separate date parts avoids browser differences
 * when parsing date-only strings.
 *
 * @param {string} isoDate
 * @returns {Date}
 */
function createLocalDate(isoDate) {

    const [
        year,
        month,
        day
    ] = isoDate
        .split("-")
        .map(Number);


    return new Date(
        year,
        month - 1,
        day,
        23,
        59,
        59
    );

}


/**
 * Builds one timeline item.
 *
 * @param {object} stop
 * @param {number} index
 * @returns {HTMLElement}
 */
function createTimelineItem(stop, index) {

    const item =
        document.createElement("article");


    item.className =
        "timeline-item";


    const travelDate =
        createLocalDate(stop.isoDate);


    const hasPassed =
        travelDate.getTime() < Date.now();


    if (hasPassed) {

        item.classList.add("completed");

    }


    item.innerHTML = `

        <div
            class="timeline-marker"
            aria-hidden="true"
        >

            <span>
                ${escapeHTML(stop.icon)}
            </span>

        </div>


        <div class="timeline-content">

            <span class="timeline-date">

                ${escapeHTML(stop.date)}

            </span>


            <h3>

                ${escapeHTML(stop.title)}

            </h3>


            <p>

                ${escapeHTML(stop.description)}

            </p>

        </div>

    `;


    /*
    Add an accessible label to the full timeline item.
    */
    item.setAttribute(

        "aria-label",

        `${stop.date}: ${stop.title}. ` +
        `${stop.description}`

    );


    /*
    The first and last items get classes that can be
    styled differently if desired.
    */
    if (index === 0) {

        item.classList.add("timeline-first");

    }


    if (
        index === travelItinerary.length - 1
    ) {

        item.classList.add("timeline-last");

    }


    return item;

}


/**
 * Draws the full itinerary timeline.
 */
function generateTravelTimeline() {

    if (!itineraryContainer) {

        console.error(

            'Travel timeline container not found. ' +
            'Add id="itineraryContainer" to index.html.'

        );

        return;

    }


    itineraryContainer.innerHTML = "";


    travelItinerary.forEach(
        (stop, index) => {

            const timelineItem =
                createTimelineItem(
                    stop,
                    index
                );


            itineraryContainer.appendChild(
                timelineItem
            );

        }
    );

}


generateTravelTimeline();/* =========================================
   Places Wishlist data
   ========================================= */

const places = [

    /* =====================================
       Seoul
       ===================================== */

    {
        city: "Seoul",
        cityIcon: "🌸",

        category: "Must See",
        categoryClass: "must-see",

        title: "Gyeongbokgung Palace",

        image:
            "Images/SEOUL/SEOUL-gyeongbokgung-palace.jpg",

        duration:
            "2–3 hours",

        cost:
            "₩3,000",

        location:
            "Gyeongbokgung Station, Exit 5",

        description:
            "The largest of Seoul’s five royal palaces, with traditional architecture, gardens and regular guard-changing ceremonies.",

        googleMaps:
            "https://www.google.com/maps/search/?api=1&query=Gyeongbokgung+Palace",

        naverMaps:
            "https://map.naver.com/p/search/Gyeongbokgung%20Palace"
    },


    {
        city: "Seoul",
        cityIcon: "🌸",

        category: "Café",
        categoryClass: "cafe",

        title: "Cafe Onion Anguk",

        image:
            "Images/SEOUL/cafe-onion.jpg",

        duration:
            "45–60 minutes",

        cost:
            "₩₩",

        location:
            "Anguk Station",

        description:
            "A popular bakery and café set inside a restored traditional hanok building.",

        googleMaps:
            "https://www.google.com/maps/search/?api=1&query=Cafe+Onion+Anguk",

        naverMaps:
            "https://map.naver.com/p/search/Cafe%20Onion%20Anguk"
    },


    {
        city: "Seoul",
        cityIcon: "🌸",

        category: "Food",
        categoryClass: "food",

        title: "Korean BBQ in Mapo-Gu (강남 돼지상회 무한리필 홍대점)",

        image:
            "Images/SEOUL/SEOUL-korean-bbq.jpg",

        duration:
            "2 hours",

        cost:
            "₩10,000–20,000 per person",

        location:
            "Mapo-Gu, Seoul",

        description:
            "Highly rated Korean BBQ restaurant in Mapo-Gu, known for its quality meats and authentic experience.",

        googleMaps:
            "https://www.google.com/maps/place/%EA%B0%95%EB%82%A8+%EB%8F%BC%EC%A7%80%EC%83%81%ED%9A%8C+%EB%AC%B4%ED%95%9C%EB%A6%AC%ED%95%84+%ED%99%8D%EB%8C%80%EC%A0%90/@37.5535385,126.921178,16z/data=!3m1!4b1!4m6!3m5!1s0x357c98db3820e667:0xf1a6aff3a5330fdb!8m2!3d37.5535385!4d126.921178!16s%2Fg%2F11h6d58syl?entry=ttu&g_ep=EgoyMDI2MDcyMi4wIKXMDSoASAFQAw%3D%3D",

        naverMaps:
            "https://map.naver.com/p/search/Korean%20BBQ%20in%20Mapo-Gu"
    },


    {
        city: "Seoul",
        cityIcon: "🌸",

        category: "Shopping",
        categoryClass: "shopping",

        title: "Gwangjang Market",

        image:
            "Images/SEOUL/SEOUL-gwangjang-market.jpg",

        duration:
            "Half day",

        cost:
            "Free to explore",

        location:
            "Jongno-gu, Seoul",

        description:
            "A bustling traditional market known for its street food, snacks, and local specialties.",

        googleMaps:
            "https://www.google.com/maps/search/?api=1&query=Gwangjang+Market",

        naverMaps:
            "https://map.naver.com/p/search/Gwangjang%20Market"
    },


    /* =====================================
       Jeju
       ===================================== */

    {
        city: "Jeju",
        cityIcon: "🌊",

        category: "Nature",
        categoryClass: "nature",

        title: "Seongsan Ilchulbong",

        image:
            "images/jeju/seongsan-ilchulbong.jpg",

        duration:
            "1–2 hours",

        cost:
            "₩5,000",

        location:
            "Eastern Jeju",

        description:
            "A volcanic tuff cone with a short summit walk and broad views across the coast.",

        googleMaps:
            "https://www.google.com/maps/search/?api=1&query=Seongsan+Ilchulbong",

        naverMaps:
            "https://map.naver.com/p/search/Seongsan%20Ilchulbong"
    },


    {
        city: "Jeju",
        cityIcon: "🌊",

        category: "Nature",
        categoryClass: "nature",

        title: "Hallasan National Park",

        image:
            "images/jeju/hallasan.jpg",

        duration:
            "Half day or full day",

        cost:
            "Free entry",

        location:
            "Central Jeju",

        description:
            "Jeju’s highest mountain, with several walking routes ranging from easier forest trails to longer summit hikes.",

        googleMaps:
            "https://www.google.com/maps/search/?api=1&query=Hallasan+National+Park",

        naverMaps:
            "https://map.naver.com/p/search/Hallasan%20National%20Park"
    },


    {
        city: "Jeju",
        cityIcon: "🌊",

        category: "Food",
        categoryClass: "food",

        title: "Jeju Black Pork",

        image:
            "images/jeju/black-pork.jpg",

        duration:
            "1–2 hours",

        cost:
            "₩₩–₩₩₩",

        location:
            "Jeju City or Seogwipo",

        description:
            "A signature Jeju meal featuring locally raised black pork, usually grilled at the table.",

        googleMaps:
            "https://www.google.com/maps/search/?api=1&query=Jeju+Black+Pork+Street",

        naverMaps:
            "https://map.naver.com/p/search/Jeju%20Black%20Pork"
    },


    /* =====================================
       Gyeongju
       ===================================== */

    {
        city: "Gyeongju",
        cityIcon: "🏯",

        category: "Historic Site",
        categoryClass: "historic",

        title: "Bulguksa Temple",

        image:
            "images/gyeongju/bulguksa.jpg",

        duration:
            "1–2 hours",

        cost:
            "Check current entry fee",

        location:
            "Bulguksa area",

        description:
            "A major historic temple complex known for its stone pagodas, courtyards and mountain setting.",

        googleMaps:
            "https://www.google.com/maps/search/?api=1&query=Bulguksa+Temple",

        naverMaps:
            "https://map.naver.com/p/search/Bulguksa%20Temple"
    },


    {
        city: "Gyeongju",
        cityIcon: "🏯",

        category: "Historic Site",
        categoryClass: "historic",

        title: "Daereungwon Tomb Complex",

        image:
            "images/gyeongju/daereungwon.jpg",

        duration:
            "1–2 hours",

        cost:
            "Check current entry fee",

        location:
            "Central Gyeongju",

        description:
            "A landscaped park containing large royal burial mounds from the Silla period.",

        googleMaps:
            "https://www.google.com/maps/search/?api=1&query=Daereungwon+Tomb+Complex",

        naverMaps:
            "https://map.naver.com/p/search/Daereungwon%20Tomb%20Complex"
    },


    {
        city: "Gyeongju",
        cityIcon: "🏯",

        category: "Must See",
        categoryClass: "must-see",

        title: "Donggung Palace and Wolji Pond",

        image:
            "images/gyeongju/wolji-pond.jpg",

        duration:
            "1–2 hours",

        cost:
            "Check current entry fee",

        location:
            "Central Gyeongju",

        description:
            "A reconstructed palace site and pond that is especially atmospheric after sunset.",

        googleMaps:
            "https://www.google.com/maps/search/?api=1&query=Donggung+Palace+and+Wolji+Pond",

        naverMaps:
            "https://map.naver.com/p/search/Donggung%20Palace%20and%20Wolji%20Pond"
    },


    /* =====================================
       Jeonju
       ===================================== */

    {
        city: "Jeonju",
        cityIcon: "🍂",

        category: "Must See",
        categoryClass: "must-see",

        title: "Jeonju Hanok Village",

        image:
            "images/jeonju/hanok-village.jpg",

        duration:
            "Half day",

        cost:
            "Free to explore",

        location:
            "Central Jeonju",

        description:
            "A large traditional neighbourhood filled with hanok buildings, food stalls, cafés and cultural experiences.",

        googleMaps:
            "https://www.google.com/maps/search/?api=1&query=Jeonju+Hanok+Village",

        naverMaps:
            "https://map.naver.com/p/search/Jeonju%20Hanok%20Village"
    },


    {
        city: "Jeonju",
        cityIcon: "🍂",

        category: "Food",
        categoryClass: "food",

        title: "Jeonju Bibimbap",

        image:
            "images/jeonju/bibimbap.jpg",

        duration:
            "1 hour",

        cost:
            "₩₩",

        location:
            "Central Jeonju",

        description:
            "Jeonju is one of Korea’s best-known destinations for bibimbap, served with colourful vegetables and regional side dishes.",

        googleMaps:
            "https://www.google.com/maps/search/?api=1&query=Jeonju+Bibimbap",

        naverMaps:
            "https://map.naver.com/p/search/Jeonju%20Bibimbap"
    },


    {
        city: "Jeonju",
        cityIcon: "🍂",

        category: "Café",
        categoryClass: "cafe",

        title: "Traditional Tea House",

        image:
            "images/jeonju/tea-house.jpg",

        duration:
            "45–60 minutes",

        cost:
            "₩₩",

        location:
            "Jeonju Hanok Village",

        description:
            "A relaxed stop for traditional Korean tea and snacks inside the hanok village.",

        googleMaps:
            "https://www.google.com/maps/search/?api=1&query=Traditional+Tea+House+Jeonju+Hanok+Village",

        naverMaps:
            "https://map.naver.com/p/search/Jeonju%20Traditional%20Tea%20House"
    }

];


/* =========================================
   Places display order
   ========================================= */

const cityOrder = [

    "Seoul",

    "Jeju",

    "Gyeongju",

    "Jeonju"

];


const categoryOrder = [

    "Must See",

    "Historic Site",

    "Museum",

    "Nature",

    "Café",

    "Food",

    "Shopping",

    "Nightlife"

];
/* =========================================
   Generate Places Wishlist
   ========================================= */

const placesContainer =
    document.getElementById("placesContainer");


/**
 * Creates one reusable travel card.
 *
 * @param {object} place
 * @returns {HTMLElement}
 */
function createTravelCard(place) {

    const card =
        document.createElement("article");


    card.className =
        "travel-card";


    card.innerHTML = `

        <img
            class="travel-card-image"
            src="${escapeHTML(place.image)}"
            alt="${escapeHTML(place.title)}"
            loading="lazy"
        >


        <div class="travel-card-body">

            <span
                class="category-badge
                ${escapeHTML(place.categoryClass)}"
            >

                ${escapeHTML(place.category)}

            </span>


            <h4>

                ${escapeHTML(place.title)}

            </h4>


            <div class="travel-card-summary">

                <span>

                    ⏱️ ${escapeHTML(place.duration)}

                </span>


                <span>

                    💰 ${escapeHTML(place.cost)}

                </span>

            </div>


            <button
                class="travel-details-toggle"
                type="button"
                aria-expanded="false"
            >

                <span class="toggle-label">
                    More information
                </span>

                <span
                    class="toggle-icon"
                    aria-hidden="true"
                >
                    ⌄
                </span>

            </button>


            <div
                class="travel-card-details"
                aria-hidden="true"
            >

                <div class="travel-card-details-inner">

                    <p class="travel-location">

                        🚇 ${escapeHTML(place.location)}

                    </p>


                    <p class="travel-description">

                        ${escapeHTML(place.description)}

                    </p>


                    <div class="travel-card-links">

                        <a
                            class="map-button"
                            href="${escapeHTML(place.googleMaps)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >

                            Google Maps

                        </a>


                        <a
                            class="map-button naver-button"
                            href="${escapeHTML(place.naverMaps)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >

                            Naver Maps

                        </a>

                    </div>

                </div>

            </div>

        </div>

    `;


    const toggleButton =
        card.querySelector(
            ".travel-details-toggle"
        );


    const toggleLabel =
        card.querySelector(
            ".toggle-label"
        );


    const details =
        card.querySelector(
            ".travel-card-details"
        );


    toggleButton.addEventListener(
        "click",
        () => {

            const isOpen =
                card.classList.toggle(
                    "is-open"
                );


            toggleButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            details.setAttribute(
                "aria-hidden",
                String(!isOpen)
            );


            toggleLabel.textContent =
                isOpen
                    ? "Less information"
                    : "More information";

        }
    );


    /*
    Add a fallback class when an image cannot load.
    */
    const image =
        card.querySelector(
            ".travel-card-image"
        );


    image.addEventListener(
        "error",
        () => {

            image.classList.add(
                "image-unavailable"
            );


            image.alt =
                `${place.title} image unavailable`;

        }
    );


    return card;

}


/**
 * Sorts categories using the preferred category order.
 *
 * Categories not listed in categoryOrder will appear last.
 *
 * @param {string} categoryA
 * @param {string} categoryB
 * @returns {number}
 */
function sortCategories(
    categoryA,
    categoryB
) {

    const indexA =
        categoryOrder.indexOf(
            categoryA
        );


    const indexB =
        categoryOrder.indexOf(
            categoryB
        );


    const safeIndexA =
        indexA === -1
            ? categoryOrder.length
            : indexA;


    const safeIndexB =
        indexB === -1
            ? categoryOrder.length
            : indexB;


    if (safeIndexA !== safeIndexB) {

        return safeIndexA - safeIndexB;

    }


    return categoryA.localeCompare(
        categoryB
    );

}


/**
 * Creates one category section within a city.
 *
 * @param {string} category
 * @param {object[]} categoryPlaces
 * @returns {HTMLElement}
 */
function createCategorySection(
    category,
    categoryPlaces
) {

    const section =
        document.createElement("section");


    section.className =
        "wishlist-category";


    const heading =
        document.createElement("h4");


    heading.className =
        "wishlist-category-heading";


    heading.textContent =
        category;


    const grid =
        document.createElement("div");


    grid.className =
        "travel-card-grid";


    categoryPlaces.forEach(
        place => {

            const card =
                createTravelCard(place);


            grid.appendChild(card);

        }
    );


    section.append(
        heading,
        grid
    );


    return section;

}


/**
 * Creates one complete city wishlist section.
 *
 * @param {string} cityName
 * @param {object[]} cityPlaces
 * @returns {HTMLElement}
 */
function createCitySection(
    cityName,
    cityPlaces
) {

    const section =
        document.createElement("section");


    section.className =
        "city-wishlist";


    section.id =
        `places-${cityName
            .toLowerCase()
            .replaceAll(" ", "-")}`;


    const cityIcon =
        cityPlaces[0]?.cityIcon || "📍";


    const headingWrapper =
        document.createElement("div");


    headingWrapper.className =
        "city-wishlist-heading";


    const heading =
        document.createElement("h3");


    heading.textContent =
        `${cityIcon} ${cityName}`;


    const count =
        document.createElement("span");


    count.textContent =
        `${cityPlaces.length} ` +
        `${cityPlaces.length === 1
            ? "place"
            : "places"}`;


    headingWrapper.append(
        heading,
        count
    );


    section.appendChild(
        headingWrapper
    );


    const categories = [

        ...new Set(

            cityPlaces.map(
                place => place.category
            )

        )

    ].sort(sortCategories);


    categories.forEach(
        category => {

            const categoryPlaces =
                cityPlaces.filter(
                    place =>
                        place.category ===
                        category
                );


            const categorySection =
                createCategorySection(
                    category,
                    categoryPlaces
                );


            section.appendChild(
                categorySection
            );

        }
    );


    return section;

}


/**
 * Generates the complete Places Wishlist.
 */
function generatePlacesWishlist() {

    if (!placesContainer) {

        console.error(

            'Places Wishlist container not found. ' +
            'Add id="placesContainer" to index.html.'

        );

        return;

    }


    placesContainer.innerHTML = "";


    cityOrder.forEach(
        cityName => {

            const cityPlaces =
                places.filter(
                    place =>
                        place.city === cityName
                );


            if (cityPlaces.length === 0) {

                return;

            }


            const citySection =
                createCitySection(
                    cityName,
                    cityPlaces
                );


            placesContainer.appendChild(
                citySection
            );

        }
    );

}


/* =========================================
   Initialise Places Wishlist
   ========================================= */

generatePlacesWishlist();