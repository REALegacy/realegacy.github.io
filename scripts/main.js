"use strict";

import { dataHandler } from "./classes/DataHandler.js";

import { CustomDropdown } from "./classes/CustomDropdown.js";



function changeFont(value){
    console.log("Font changed:", value);

    document.documentElement.setAttribute("data-font", value);
}

function changeTheme(value){
    console.log("Theme changed:", value);

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
                title.textContent = entry.target.id;
            }
        });
    }, {rootMargin: "-40% 0px -40% 0px"});

    document.querySelectorAll("section[id]").forEach((section) => {
        observer.observe(section);
    });
}

function updateModPackStatus(isCompitable) {
    const statusLabel = document.getElementById("modpack-status");

    statusLabel.textContent = isCompitable? 'Laatste versie' : 'Update beschikbaar';
    statusLabel.style.color = isCompitable? '#004d26' : '#690202';
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
});

changeFont(window.localStorage.getItem("REALegacy/font") || "mayan")
changeTheme(window.localStorage.getItem("REALegacy/theme") || "auto");
updateTitle();
showModPackStatus();
showVersion();