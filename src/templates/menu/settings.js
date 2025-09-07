import Settings from '../../Settings'

export function settingsSubmit(container) {
    const form = container.querySelector('#settings-form')
    const inputs = form.querySelectorAll('input[name]')

    inputs.forEach((el) => {
        el.value = Settings.get(el.name)
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const data = new FormData(e.target)

        data.entries().forEach(([name, value]) => {
            Settings.change(name, +value)
        })
    })
}
