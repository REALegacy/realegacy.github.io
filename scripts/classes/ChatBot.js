import Translator from "../classes/Translator.js";
import { ChatBotChatBubble } from "../components/ChatBotChatBuble.js";
import { helper } from "./Helper.js";

const translator = new Translator({
    basePath: "data/lang",
})

class ChatBot {
    lang = localStorage.getItem("REALegacy/lang") || "en_us";
    gender = localStorage.getItem("REALegacy/chat-bot/gender") || "male";

    canSendMsg = false;
    haveStartMsg = false;

    msgCashe = [];

    prompts = {
        intro : {
            key: "intro",
        }
    }

    _getNameByGender() {
        return this.gender === "male" ? "steven" : "alexandria"
    }

    async initialize(isEnabled) {
        const open = document.getElementById("chat-bot-open");

        // if (!isEnabled) {
        //     open.style.display = "none";
        //     return;
        // }

        await translator.load();
        this.sendWelcome();

        const close = document.getElementById("chat-bot-close");
        const chat = document.getElementById("chat-bot-chat");

        const chatInput = document.getElementById("chat-bot-input");
        const sendChat = document.getElementById("chat-bot-send-chat");

        const nameOfBot = document.getElementById("chat-bot-name");

        nameOfBot.textContent = this._getNameByGender() + translator.translate("chatbot.top.title");

        open.addEventListener("click", (event) => {
            open.style.display = "none";
            chat.style.display = "flex";
            if (!this.haveStartMsg) {
                this.playSound("intro");
                this.haveStartMsg = true;
            }
        })

        close.addEventListener("click", (event) => {
            open.style.display = "inline";
            chat.style.display = "none";
        })

        const genderButtons = document.querySelectorAll(".chat-bot-gender-switch");

        this._closeAllGenderButtons(genderButtons);

        genderButtons.forEach(element => {
            const elGender = element.getAttribute("data-chat-bot-gender")?.toLowerCase();
            const currentGenderKey = `chatbot.top.gender.${elGender}.current`;

           if (elGender === this.gender){
            element.style.display = "inline";
           }

            element.title = translator.translate(currentGenderKey, "Gender: unknown");

            element.addEventListener("click", (event) => {
                this.gender = this.gender === "male" ? "female" : "male";
                window.localStorage.setItem("REALegacy/chat-bot/gender", this.gender);
                this._closeAllGenderButtonsAndOpen(genderButtons, this.gender);
                chatInput.placeholder = translator.translate("chatbot.window.chat.input.placeholder", "Type here...") + this._getNameByGender();
                nameOfBot.textContent = this._getNameByGender() + translator.translate("chatbot.top.title");
            })
        });

        

        chatInput.placeholder = translator.translate("chatbot.window.chat.input.placeholder", "Type here...") + this._getNameByGender();

        sendChat.addEventListener("click", (event) => {
            if (this.canSendMsg) {
                this.sendChat(chatInput.value);
                chatInput.value = "";
            }
        })

        chatInput.addEventListener("keydown", (event) => {
            if (this.canSendMsg) {
                if (event.key === "Enter") {
                    event.preventDefault();

                    this.sendChat(chatInput.value);
                    chatInput.value = "";
                }
            }
        });

        const clear = document.getElementById("chat-bot-clear");

        clear.title = translator.translate("chatbot.top.clear", "remove chat");

        clear.addEventListener("click", (event) => {
            this._clearChat();
            this.playSound("intro");
        })
    }

    _closeAllGenderButtons(genderButtons) {
        genderButtons.forEach(element => {
            element.style.display = "none"
        });
    }

    _closeAllGenderButtonsAndOpen(genderButtons, newGender) {
        genderButtons.forEach(element => {
            element.style.display = "none"
        });

        genderButtons.forEach(element => {
            const elGender = element.getAttribute("data-chat-bot-gender")?.toLowerCase();

           if (elGender === newGender){
            element.style.display = "inline";
           }
        });
    }

    _clearChat() {
        const deleteChat = window.confirm(translator.translate("chatbot.top.clear.confirm"))

        if (deleteChat) {
            this.msgCashe.forEach(msg => {
                msg.destroy();
            });

            this.msgCashe = [];
        }

        this.sendWelcome();
    }

    sendWelcome() {

        const botName = this._getNameByGender();
        const formattedBotName = botName.charAt(0).toUpperCase() + botName.slice(1);

        const newMsgBot = new ChatBotChatBubble()

        const msg = translator.translate("chatbot.chat.intro." + this.gender, "Hallo Human"); 
        
        const msgBot = newMsgBot.build(document.getElementById("chat-bot-chat-window"), true, "chat-bot-chat-pfp-bot-" + this.gender, formattedBotName, msg);

        this.msgCashe.push(msgBot);

        this.canSendMsg = true;
    }

    playSound(key = "idk") {
        const lang = window.localStorage.getItem("REALegacy/lang").split("_")[0];

        const gender = this._getNameByGender()

        const sound = `${key}-${gender}-ai-${lang}.m4a`

        const newSound = new Audio("./assets/media/sounds/chat-bot/" + sound);

        if (newSound) {
            newSound.play();
        } else {
            console.warn("Sound not found: " + sound);
        }
    }

    async sendChat(chatMsg) {

        const newMsg = new ChatBotChatBubble()

        const msg = newMsg.build(document.getElementById("chat-bot-chat-window"), false, "", "", chatMsg);

        this.msgCashe.push(msg);

        const pattern = new RegExp("(hi|hoi|hai|yo|hello|hallo|whats up)", "i");
        
        let responseKey = "";

        if (pattern.test(chatMsg)) {
            const rand = helper.random(1, 4);

            const randToResponse = [
                {
                    rand: 1,
                    key: "hoi"
                },
                {
                    rand: 2,
                    key: "hai"
                },
                {
                    rand: 3,
                    key: "hi"
                },
                {
                    rand: 4,
                    key: "hello"
                }
            ]

            for (let i = 0; i < randToResponse.length; i++) {
                const data = randToResponse[i];
                if (data.rand === rand){
                    responseKey = data.key;
                }
            }
        } else {
            responseKey = "idk";
        }

        const aiResponse = translator.translate("chatbot.chat." + responseKey, "Were sorry but something went frong the AI said: Fatall error");

        const botName = this._getNameByGender();
        const formattedBotName = botName.charAt(0).toUpperCase() + botName.slice(1);

        const typingIndicator = document.getElementById("chat-bot-typing")

        typingIndicator.textContent = formattedBotName + translator.translate("chatbot.chat.typing", " Is aan het denken.")
        this.canSendMsg = false;

        await new Promise(resolve => setTimeout(resolve, helper.random(1000, 10000)));

        typingIndicator.textContent = "";
        this.canSendMsg = true;

        const newMsgBot = new ChatBotChatBubble()

        
        const msgBot = newMsgBot.build(document.getElementById("chat-bot-chat-window"), true, "chat-bot-chat-pfp-bot-" + this.gender, formattedBotName, aiResponse);

        this.msgCashe.push(msgBot);

        this.playSound(responseKey);
    }
}

export const chatBot = new ChatBot();