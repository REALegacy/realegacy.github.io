export class CustomDropdown {
    constructor(element) {
        this.container = element;
        this.toggle = this.container.querySelector(".dropdown-toggle");
        this.list = this.container.querySelector(".dropdown-list");
        this.selectedSpan = this.toggle.querySelector("span");

        this.storageKey = this.container.dataset.storageKey;
        this.customEventName = this.container.dataset.customEvent;

        this.init();
        this.loadSavedValue();
    }

    init() {
        this.toggle.addEventListener("click", (event) => {
            event.stopPropagation();

            CustomDropdown.closeAll(this.list);

            this.list.classList.toggle("open");
        });

        this.container.querySelectorAll(".dropdown-options li").forEach(item => {
            item.addEventListener('click', (event) => {
                event.stopPropagation();

                this.selectItem(item);
            });
        });
    }

    selectItem(item) {
        this.selectedSpan.innerHTML = item.innerHTML;

        this.list.classList.remove("open");

        const value = item.getAttribute("data-value");

        localStorage.setItem(this.storageKey, value);

        this.container.dispatchEvent(new CustomEvent(this.customEventName, {
            detail: {value: value, item: item}
        })
    );
    }

    loadSavedValue() {
        const savedValue = localStorage.getItem(this.storageKey);

        if (!savedValue) {
            return;
        }

        const item = this.container.querySelector(`.dropdown-options li[data-value="${savedValue}"]`);

        if (item) {
            this.selectedSpan.innerHTML = item.innerHTML;
        }
    }

    static closeAll(exceptList = null) {
        document.querySelectorAll(".dropdown-list").forEach(list => {
            if (list !== exceptList) {
                list.classList.remove("open");
            }
        });
    }
}
