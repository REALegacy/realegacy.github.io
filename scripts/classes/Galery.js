import { GaleryGridCard } from "../components/GaleryGridCard.js";

class Galery {
    gridLoaded = false;
    open(run, data, allData){
        const children = document.querySelectorAll(".popup-setup-run-galery");
        const opens = run !== "" ? run : "galery-grid";

        children.forEach((element) => {
            if(element.getAttribute("data-run") === opens){
                element.style.display = element.getAttribute("data-display");
            } else {
                element.style.display = "none";
            }
        })

        this.init(data, run, allData)
    }

    init(data, run, allData){
        if(run === "galery-grid"){
            if(!this.gridLoaded){
                this.gridLoaded = true;

                // loop trough the images to create grid
                for(let i = 0; i < allData.galery.images.length; i++){
                    const imageData = allData.galery.images[i];

                    const newImageCard = new GaleryGridCard();

                    newImageCard.build(imageData, document.getElementById("galery-grid"), allData);

                    // make image card clickable
                    // after click do the popup class close all with data
                    // data is image data alst title etc
                    // make this open teh viewer elemnts

                    // when opening image the data from image also be saved in sesion storage for teh back button when viewing an profile
                }
            }
        }
    }
}

export const galery = new Galery()