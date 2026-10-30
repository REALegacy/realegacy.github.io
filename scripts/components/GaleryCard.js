import { builder } from "../classes/Builder.js";
import Translator from "../classes/Translator.js";

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

export class GaleryCard {
    element;

    build(data, parent, allData, isRandomPreview) {
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
                ], [], translator.translate("page.galery.pictures.tag.old_server", "Oude server"), cardTop
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
                },
                {
                    type:"alt",
                    content: data.alt
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
            ], [], (showUser ? translator.translate("page.galery.pictures.by","Bij: ") +  user.userName : ""), cardBottomTop
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
                    },
                    {
                        type:"data-opens",
                        content: isRandomPreview? "profile-popup" : "galery-popup"
                    },
                    {
                        type:"data-setup-run",
                        content: isRandomPreview? "" : "galery-profile"
                    }
                ], translator.translate("page.galery.pictures.see_profile","Bekijk profiel (binnenkort)"), cardBottomTop
            )
        }

        builder.addElement("p", "",
            [
                "galery-card-desc"
            ], [], data.description, cardBottom
        )

        builder.addElement("hr", "", [], [], "", this.element);

        const footer = builder.addElement("div", "",
            [
                "galery-card-footer"
            ], [], "", this.element
        )

        const pagePublishDate = new Date(data.publishTimeStamp * 1000);
        const pageUpdateDate = new Date(data.updateTimeStamp * 1000);

        

        builder.addElement("span", "", [],[], 
            `${translator.translate("page.galery.pictures.taken", "afbeelding genomen: ")} ${data.takenTime} | ${translator.translate("page.galery.pictures.made", "afbeelding data aangemaakt:")} ${pagePublishDate.toLocaleDateString()} ${pagePublishDate.getHours()}:${pagePublishDate.getMinutes().toString().padStart(2, '0')} | ${translator.translate("page.galery.pictures.updated", "afbeelding data updated: ")} ${pageUpdateDate.toLocaleDateString()} ${pageUpdateDate.getHours()}:${pageUpdateDate.getMinutes().toString().padStart(2, '0')}`,
            footer
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