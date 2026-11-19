import { builder } from "../classes/Builder.js";
import Translator from "../classes/Translator.js";

const translator = new Translator({
    basePath: "data/lang",
})

translator.load();

export class ChatBotChatBubble {
    element;

    build(parent, left, botPfpClass, botName, chatResponse) {
        this.element = document.createElement("div");

        const parentClass = left ? "chat-bot-chat-bubble-left" : "chat-bot-chat-bubble-right"

        this.element.classList.add(parentClass);

        const pfp = builder.addElement("div", "",
            [
                "chat-bot-chat-pfp-wrapper"
            ], [], "", this.element
        )

        const pfpBg = builder.addElement("div", "", 
            [
                left ? botPfpClass : "chat-bot-chat-pfp-human"
            ], [], "", pfp
        )

        builder.addElement("i", "",
            [
                "bx",
                left ? "bx-robot" : "bx-user"
            ], [], "", pfpBg
        )

        const bubbleWrapper = builder.addElement("div", "",
            [
                "chat-bot-chat-bubble-wrapper"
            ], [], "", this.element
        )

        const bubble = builder.addElement("div", "",
            [
                "chat-bot-chat-bubble"
            ], [], "", bubbleWrapper
        )

        builder.addElement("span", "",
            [
                "chat-bot-chat-bubble-name"
            ], [], left ? botName : "you", bubble
        )

        builder.addElement("span", "",
            [
                "chat-bot-chat-bubble-content"
            ], [], chatResponse, bubble
        )

         parent.appendChild(this.element);

         return this;
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}