import { builder } from "../classes/Builder.js";

export class GaleryCard {
    element;

    build(data, parent, allData) {
        this.element = document.createElement("div");
        this.element.classList.add('gallery-card');

        const cardTop = builder.addElement("div", "", 
            [
                "galery-card-top"
            ], [], "", this.element
        )
        
        builder.addElement("span", "", 
            [
                "galery-card-title"
            ],
            [
                {
                    type: "title",
                    content: "test"
                }
            ], data.title, cardTop
        )

        if(data.isOld){
            builder.addElement("div", "",
                [
                    "label",
                    "label-orange"
                ], [], "Oude server", cardTop
            )
        }

        builder.addElement("img", "", 
            [
                "galery-card-img"
            ],
            [
                {
                    type:"src",
                    content: data.imageUrl
                }
            ], "", this.element
        )

        const cardBottom = builder.addElement("div", "", 
            [
                "galery-card-bottom"
            ], [], "", this.element
        )

        const cardBottomTop = builder.addElement("div", "", 
            [
                "galery-card-bottom-top"
            ], [], "", cardBottom
        )

        const user = allData.users[String(data.auteur.userId)];

        const showUser = user && data.auteur.showAuteur;

        builder.addElement("span", "",
            [
                "galery-card-auteur"
            ], [], (showUser ? "Bij: " +  user.userName : ""), cardBottomTop
        )

        if(showUser){
            let links = '';

            if(user.showLinks){
                if(Array.isArray(user.links)){
                    user.links.forEach((link) => {
                        const type = link.type;
                        const url = link.url;

                        links += `|${type}*${url}`
                    });
                }
            }
            
            builder.addElement("button", "",
                [
                    "profile-button",
                    "cta-button"
                ], 
                [
                    {
                       type: "data-showlinks",
                       content: user.showLinks ? "true" : "false" 
                    },
                    {
                       type: "data-username",
                       content: user.userName 
                    },
                    {
                       type: "data-bio",
                       content: user.bio 
                    },
                    {
                       type: "data-userid",
                       content: data.auteur.userId 
                    },
                    {
                       type: "data-links",
                       content: links 
                    }
                ], "Bekijk profiel (binnenkort)", cardBottomTop
            )
        }

        builder.addElement("p", "",
            [
                "galery-card-desc"
            ], [], data.description, cardBottom
        )

        parent.appendChild(this.element);
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}