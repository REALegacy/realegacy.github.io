import { GaleryGridCard } from "../components/GaleryGridCard.js";
import { GaleryCard } from "../components/GaleryCard.js";
import { popupHandler } from "./PopupHandler.js";

class Galery {
    gridLoaded = false;
    viewerCard = null;
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

                    newImageCard.element.addEventListener("click", () => {
                        const elmnt = newImageCard.element.querySelector(".galery-grid-card");

                        console.log(elmnt);

                        const data = {
                            title: elmnt.getAttribute("data-title"),
                            id: Number(elmnt.getAttribute("data-id")),
                            description: elmnt.getAttribute("data-description"),
                            isOld: elmnt.getAttribute("data-is-old") === "true",
                            imageUrl: elmnt.getAttribute("data-image-url"),
                            alt: elmnt.getAttribute("data-alt"),
                            publishTimeStamp: Number(elmnt.getAttribute("data-publish-time-stamp")),
                            updateTimeStamp: Number(elmnt.getAttribute("data-update-time-stamp")),
                            takenTime: elmnt.getAttribute("data-taken-time"),
                            auteur: {
                                showAuteur: elmnt.getAttribute("data-show-auteur") === "true",
                                userId: Number(elmnt.getAttribute("data-user-id"))
                            }
                        }

                        console.log(data);

                        window.sessionStorage.setItem("REALegacy/lastViewingImage", JSON.stringify(data));

                        popupHandler.open("galeryViewer", data, allData)
                    })

                    // make image card clickable
                    // after click do the popup class close all with data
                    // data is image data alst title etc
                    // make this open teh viewer elemnts

                    // when opening image the data from image also be saved in sesion storage for teh back button when viewing an profile
                }
            }
        } else if(run === "galery-viewer"){
            const titleBar = document.getElementById("popup-galery-viewer-title-bar")

            titleBar.textContent = `img:galery/${data.id}/${data.title.toLowerCase().trim().replace(/\s+/g, "-")}.png`
            
            if (this.viewerCard) {
                this.viewerCard.destroy();
            }
        
            this.viewerCard = new GaleryCard()
        
            const parentContainer = document.getElementById('galery-viewer'); 
            this.viewerCard.build(data, parentContainer, allData, true);
        
            this.viewerCard.element.classList.add("galery-card-viewer")
        }
    }
}

export const galery = new Galery()