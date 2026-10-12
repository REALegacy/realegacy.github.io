class Helper {
    generateUUID() {
        return crypto.randomUUID();
    }

    random(min, max, dec, include) {
        const includeMinMax = include || true;
        const decimal = dec || 0;
        let decimalToAdd;

        if (Math.floor(Math.random() * (2 - 1 + 1)) + 1 === 1) {
            decimalToAdd = decimal;
        } else {
            decimalToAdd = 0;
        }
        
        if (includeMinMax) {
            return Math.floor(Math.random() * (max - min + 1)) + min + decimalToAdd;
        } else {
            return Math.random() * (max - min) + min + decimalToAdd;
        }
    }
}

export const helper = new Helper()