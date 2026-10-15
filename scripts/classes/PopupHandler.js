import { galery } from "./Galery.js";

class PopupHandler {
    
    /**
     * @param {string} opens - The ID of the popup to open, or "" to close all popups.
     * @param {string} run - an string matching data-run attribute of the elements to show in the child popup. this is also what makes sure spesefic function runs in teh class for the popup
     * @param {*} data - extra data to pass.
     * @param {*} allData - the json data.
     */
    closeAllPopups(opens, run, data, allData){

        const popups = document.querySelectorAll(".popup")

        popups.forEach((elemnt) => {
            elemnt.style.display = "none";
        })

        if(opens === ""){
            document.getElementById("popups").style.display = "none";
        } else {
            document.getElementById("popups").style.display = "flex";
            document.getElementById(opens).style.display = document.getElementById(opens).getAttribute("data-display");
            if(opens === "galery-popup") {
                galery.open(run, data, allData)
            }
        }  
    }

    getLinksObjectFromString(){

    }

    open(type, data, allData){
        if(type === "galeryViewer"){
            this.closeAllPopups("galery-popup", "galery-viewer", data, allData);
        }
    }
}

export const popupHandler = new PopupHandler();