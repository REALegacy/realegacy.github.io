"use strict";

import { dataHandler } from "./classes/DataHandler.js";

import { CustomDropdown } from "./classes/CustomDropdown.js";
import { helper } from "./classes/Helper.js";
import { GaleryCard } from "./components/GaleryCard.js";
import { popupHandler } from "./classes/PopupHandler.js";
import Translator from "./classes/Translator.js";

const supportedLanguages = {
    en: "en_us",
    nl: "nl_nl"
};

function getSysLang() {
    const lang = navigator.language.toLowerCase().split("-")[0];

    return supportedLanguages[lang] ?? "en_us";
}

function isProduction() {
    const localSimulateProduction = false;
    const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);

    return !isLocal || localSimulateProduction;
}

const translator = new Translator({
    basePath: "data/lang",
    language: window.localStorage.getItem("REALegacy/lang") || getSysLang(),
    production: isProduction()
})

translator.load();

function loadTranslations() {
    const translatables = document.querySelectorAll(".translatable");

    translatables.forEach((element) => {
        if (element.getAttribute("data-translation-key")) {
            element.textContent = translator.translate(element.getAttribute("data-translation-key"), element.getAttribute("data-default-translation"));
        }

        if (element.getAttribute("data-alt-translation-key")) {
            element.alt = translator.translate(element.getAttribute("data-alt-translation-key"), element.getAttribute("data-alt-default-translation"));
        }
    })
}



function changeFont(value){
    document.documentElement.setAttribute("data-font", value);
}

function changeTheme(value){
    if(value === "auto"){
        if(window.matchMedia("(prefers-color-scheme: dark)").matches){
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
        }
    } else {
        document.documentElement.setAttribute("data-theme", value);
    }
}

const data = await dataHandler.getData();

function toggleSettings(open){
    document.documentElement.setAttribute("data-settings", open? "open": "closed");
}

function toggleHamburger(open, button){
    document.documentElement.setAttribute("data-hamburger", open? "open": "closed");
    button.querySelector("i").classList.add(open? "bx-x": "bx-menu");
    button.querySelector("i").classList.remove(open? "bx-menu": "bx-x");
}


function updateTitle(){
    const title = document.getElementById("header-text");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                title.textContent = translator.translate(entry.target.getAttribute("data-title-key"), entry.target.id);
            }
        });
    }, {rootMargin: "-40% 0px -40% 0px"});

    document.querySelectorAll("section[id]").forEach((section) => {
        if(section.getAttribute("data-track-title") === "true"){
            observer.observe(section);
        }
    });
}



function updateModPackStatus(isCompitable) {
    const statusLabel = document.getElementById("modpack-status");

    statusLabel.textContent = isCompitable ? translator.translate("page.home.modpack_status.up_to_date", "Laatste versie") : translator.translate("page.home.modpack_status.needs_update", "Update beschikbaar");
    statusLabel.style.color = isCompitable ? '#004d26' : '#690202';
}

function showModPackStatus() {

    const savedCompitabilityVersion = window.localStorage.getItem("REALegacy/modPackStatus") || "0";

    const compitabilityVersion = Number(savedCompitabilityVersion);

    const isCompitable = compitabilityVersion >= data.info.modPackVersion;

    updateModPackStatus(isCompitable);
}

let lastDownloadTime = 0;
const debounceTime = 5000;

function downloadModpack(){
    const currentTime = Date.now();

    const btn = document.getElementById("download-mod-pack");
    
    if (currentTime - lastDownloadTime < debounceTime) {
        return; 
    }
    
    
    lastDownloadTime = currentTime;

    btn.disabled = true;
    btn.textContent = "Bezig met downloaden...";

    const link = document.createElement("a");

    link.href = "./assets/mods/rea_mc_server_client_mods.zip";
    link.download = `REA-Legacy-SMP-v${data.info.modPackVersion}.zip`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    localStorage.setItem("REALegacy/modPackStatus", data.info.modPackVersion);
    updateModPackStatus(true);

    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "Download modPack";
    }, debounceTime);
}

function showVersion(){
    const versionClass = document.querySelectorAll(".version");

    versionClass.forEach((elem) => {
        elem.textContent = data.info.version;
    })
}

const modPackInstallButton = document.getElementById("download-mod-pack");

modPackInstallButton.addEventListener("click", downloadModpack);

let settingsOpen = false;
const settingsButton = document.getElementById("toggle-settings");

settingsButton.addEventListener("click", () => {
    settingsOpen = !settingsOpen
    toggleSettings(settingsOpen);
})

let hamburgerOpen = false;
const hamburgerButton = document.getElementById("toggle-hamburger");

hamburgerButton.addEventListener("click", () => {
    hamburgerOpen = !hamburgerOpen
    toggleHamburger(hamburgerOpen, hamburgerButton);
})

window.addEventListener("click", () => {
    CustomDropdown.closeAll();
});

document.querySelectorAll(".custom-dropdown").forEach(dropdown => {
    new CustomDropdown(dropdown);

    dropdown.addEventListener("fontchange", (event) => {
        changeFont(event.detail.value);
    });

    dropdown.addEventListener("themechange", (event) => {
        changeTheme(event.detail.value);
    });

    dropdown.addEventListener("langchange", (event) => {
        window.location.reload();
    })
});

// galery

let randomCard = null;


function showRandomImage(){
    const randomNum = helper.random(0, data.galery.images.length - 1);
    const imageData = data.galery.images[randomNum]

    // console.log(randomNum, imageData);

    if (randomCard) {
        randomCard.destroy();
    }

    randomCard = new GaleryCard()

    const parentContainer = document.getElementById('random-galery-card'); 
    randomCard.build(imageData, parentContainer, data, true);

    randomCard.element.classList.add("galery-card-random")

    setTimeout(showRandomImage, 10000);
}

const openGaleryPopup = document.getElementById("open-galery");

openGaleryPopup.addEventListener("click", () => {
    popupHandler.closeAllPopups("galery-popup", "galery-grid", {}, data)
})

const closePopupButtons = document.querySelectorAll(".popup-close");

closePopupButtons.forEach((elemnt) => {
    elemnt.addEventListener("click", () => {
        popupHandler.closeAllPopups("", "", {}, data)
    })
})

const backPopupButtons = document.querySelectorAll(".popup-back");

backPopupButtons.forEach((elemnt) => {
    elemnt.addEventListener("click", () => {
        popupHandler.closeAllPopups(elemnt.getAttribute("data-opens"), elemnt.getAttribute("data-setup-run"), JSON.parse(window.sessionStorage.getItem("REALegacy/lastViewingImage")), data)
    })
})

// functions

changeFont(window.localStorage.getItem("REALegacy/font") || "mayan")
changeTheme(window.localStorage.getItem("REALegacy/theme") || "auto");
updateTitle();
showModPackStatus();
showVersion();
showRandomImage();
loadTranslations();