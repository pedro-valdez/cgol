function synchronizeInputPair(container = document, id) {
    const inputs = container.querySelectorAll(`input[data-synchronize="${id}"]`)
    const inputA = inputs[0]
    const inputB = inputs[1]

    inputA.addEventListener('input', (e) => {
        inputB.value = e.target.value
    })
    inputB.addEventListener('input', (e) => {
        inputA.value = e.target.value
    })
}

export function synchronizeInputPairs(container = document) {
    const inputs = container.querySelectorAll('[data-synchronize]')
    const uniqueSynchronize = new Set(
        Array.from(inputs, (i) => i.dataset.synchronize)
    )

    uniqueSynchronize.forEach((id) => synchronizeInputPair(container, id))
}
