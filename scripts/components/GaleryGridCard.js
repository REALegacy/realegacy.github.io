import { builder } from "../classes/Builder.js";
import { helper } from "../classes/Helper.js";


export class GaleryGridCard {
    element;

    build(data, parent, allData) {
        this.element = document.createElement("div");
        this.element.classList.add('gallery-card');
        this.element.setAttribute("data-uid", helper.generateUUID());
        
        const card = builder.addElement("div", "",
            [
                "galery-grid-card"
            ], 
            [
                {
                    type:"data-title",
                    content:data.title
                },
                {
                    type:"data-id",
                    content:data.id
                },
                {
                    type:"data-description",
                    content:data.description
                },
                {
                    type:"data-is-old",
                    content:data.isOld ? "true" : "false"
                },
                {
                    type:"data-image-url",
                    content:data.imageUrl
                },
                {
                    type:"data-alt",
                    content:data.alt
                },
                {
                    type:"data-publish-time-stamp",
                    content:data.publishTimeStamp
                },
                {
                    type:"data-update-time-stamp",
                    content:data.updateTimeStamp
                },
                {
                    type:"data-taken-time",
                    content:data.takenTime
                },
                {
                    type:"data-show-auteur",
                    content:data.auteur.showAuteur? "true" : "false"
                },
                {
                    type:"data-user-id",
                    content:data.auteur.userId
                }
            ], "", this.element
        )

        builder.addElement("img", "", 
            [],
            [
                {
                    type:"src",
                    content: data.imageUrl
                },
                {
                    type:"alt",
                    content: data.alt
                }
            ], "", card
        )

        builder.addElement("span", "", 
            [
                "galery-grid-card-title"
            ], [], data.title, card
        )

        if(data.isOld){
            builder.addElement("div", "", 
                [
                    "label",
                    "label-orange",
                    "galery-grid-card-label-old"
                ], [], "Oude server", card
            )
        }

        
        

        parent.appendChild(this.element);
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}