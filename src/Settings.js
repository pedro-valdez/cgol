export default class Settings {
    static #settings = {}

    static ensure(key, cb, fallbackValue) {
        const hasKey = Settings.#settings.hasOwnProperty(key)

        if (!hasKey) {
            Settings.#settings[key] = {
                value: fallbackValue,
                callbacks: [cb],
            }

            return fallbackValue
        }

        const setting = Settings.#settings[key]
        const hasValue = 'value' in setting
        const hasCallbackArray = Array.isArray(setting.callbacks)

        if (!hasValue) {
            setting.value = fallbackValue
        }

        if (!hasCallbackArray) {
            setting.callbacks = []
        }

        if (cb && !setting.callbacks.includes(cb)) {
            setting.callbacks.push(cb)
        }

        return setting.value
    }

    static get(key) {
        return Settings.#settings[key]?.value
    }

    static change(key, value) {
        const setting = Settings.#settings[key]

        if (setting === undefined) {
            throw new Error(
                `${Settings.change.name} called with nonexistent key: ${key}`
            )
        }

        setting.value = value
        setting.callbacks.forEach((cb) => cb(value))
    }
}
