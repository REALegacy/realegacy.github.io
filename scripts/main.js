"use strict";

import { dataHandler } from "./classes/DataHandler.js";

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

    statusLabel.textContent = isCompitable? 'ja' : 'nee';
    statusLabel.style.color = isCompitable? '#004d26' : '#690202';
}

function showModPackStatus() {

    const savedCompitabilityVersion = window.localStorage.getItem("REALegacy/modPackStatus") || "0";

    const compitabilityVersion = Number(savedCompitabilityVersion);

    const isCompitable = compitabilityVersion >= data.info.modPackVersion;

    updateModPackStatus(isCompitable);
}

function downloadModpack(){
    const link = document.createElement("a");

    link.href = "./assets/mods/rea_mc_server_client_mods.zip";
    link.download = `REA-Legacy-SMP-v${data.info.modPackVersion}.zip`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    localStorage.setItem("REALegacy/modPackStatus", data.info.modPackVersion);
    updateModPackStatus(true);
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