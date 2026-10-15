import { helper } from "./Helper.js";

class Builder {
    addElement(elementType, id, classes = [], attributes = [], content = "", parent) {
        const element = document.createElement(elementType);

        element.id = id;
        element.setAttribute("data-uid", helper.generateUUID());

        if (Array.isArray(classes)) {
            classes.forEach((cls) => {
                element.classList.add(cls);
            });
        }

        if (Array.isArray(attributes)) {
            attributes.forEach((att) => {
                element.setAttribute(att.type, att.content);
            });
        }

        element.textContent = content;

        parent.appendChild(element);

        return element;
    }
}

export const builder = new Builder();