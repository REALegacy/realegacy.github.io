
export default class Translator {
    constructor({basePath = "/data/lang", language = "en_us", production = false,cache = true,cacheDuration = 24 * 60 * 60 * 1000} = {}) {
        this.basePath = basePath.replace(/\/$/, "");
        this.language = language;
        this.production = production;

        this.cacheEnabled = production || cache;

        this.cacheDuration = production ? 24 * 60 * 60 * 1000 : cacheDuration;

        this.translations = {};
    }

    getCacheKey(language) {
        return `translations_${language}`;
    }

    async load(language = this.language) {
        this.language = language;

        const cacheKey = this.getCacheKey(language);

        if (this.cacheEnabled) {
            try {
                const cached = sessionStorage.getItem(cacheKey);

                if (cached) {
                    const entry = JSON.parse(cached);
                    const isValid = Date.now() - entry.timestamp < this.cacheDuration;

                    if (isValid && entry.translations) {
                        this.translations = entry.translations;
                        return this.translations;
                    }

                    sessionStorage.removeItem(cacheKey);
                }
            } catch (error) {
                console.warn("Could not read translation cache:", error);
            }
        }

        const url = `${this.basePath}/${this.language}.json`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to load translations for "${language}": ${response.status}`);
        }

        const translations = await response.json();

        this.translations = translations;

        if (this.cacheEnabled) {
            try {
                sessionStorage.setItem(
                    cacheKey,
                    JSON.stringify({timestamp: Date.now(),translations})
                );
            } catch (error) {
                console.warn("Could not save translation cache:", error);
            }
        }

        return this.translations;
    }

    setLanguage(language) {
        return this.load(language);
    }

    translate(key, defaultTranslation, replacements = {}) {
        let value = this.translations[key];

        if (typeof value !== "string") {
            return defaultTranslation;
        }

        for (const [name, replacement] of Object.entries(replacements)) {
            value = value.replaceAll(`{${name}}`, String(replacement));
        }

        return value;
    }

    clearCache(language = null) {
        if (language) {
            sessionStorage.removeItem(this.getCacheKey(language));
            return;
        }

        for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const key = sessionStorage.key(i);

            if (key?.startsWith("translations_")) {
                sessionStorage.removeItem(key);
            }
        }
    }
}
