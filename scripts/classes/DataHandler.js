class DataHandler {
    data = null;
    loading = null;

    constructor() {
        this.loading = this.load();
    }

    async load() {
        const response = await fetch("./data/data.json");

        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.status}`);
        }

        this.data = await response.json();
    }

    async getData() {
        await this.loading;

        return this.data;
    }
}

export const dataHandler = new DataHandler();