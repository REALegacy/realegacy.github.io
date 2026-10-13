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
            ], [], "", this.element
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