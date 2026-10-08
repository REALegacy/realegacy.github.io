"use strict";

import { dataHandler } from "./classes/DataHandler.js";

import { CustomDropdown } from './classes/CustomDropdown.js';

window.addEventListener('click', () => {
    CustomDropdown.closeAll();
});

document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    new CustomDropdown(dropdown);

    dropdown.addEventListener('dropdownchange', (event) => {
        console.log('Dropdown changed:', event.detail.value);

        document.documentElement.setAttribute('data-font', event.detail.value);
    });
});

const data = await dataHandler.getData();

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
    const versionClass = document.querySelectorAll('.version');

    versionClass.forEach((elem) => {
        elem.textContent = data.info.version;
    })
}

const modPackInstallButton = document.getElementById("download-mod-pack")

modPackInstallButton.addEventListener("click", downloadModpack)

updateTitle();
showModPackStatus();
showVersion();