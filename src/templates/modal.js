import { synchronizeInputPairs } from './menu/settings'
import modalHtml from './modal.html?raw'

function getModal() {
    return document.querySelector('#modal')
}

function mapModalByFilename() {
    const modalByFilePath = import.meta.glob('./menu/*.html', {
        import: 'default',
        eager: true,
        query: '?raw',
    })
    const modalByFilename = Object.fromEntries(
        Object.entries(modalByFilePath).map(([path, content]) => {
            const filename = path.split('/').pop()
            const name = filename.slice(0, -5) // Remove `.html`

            return [name, content]
        })
    )

    return modalByFilename
}

function hydrateModalContent(id) {
    const modalByFilename = mapModalByFilename()

    const template = document.createElement('template')
    template.innerHTML = modalByFilename[id] ?? ''

    const modal = getModal()
    const modalContent = modal.querySelector('#modal-content')

    modalContent.replaceChildren(template.content.cloneNode(true))

    if (id === 'settings') {
        synchronizeInputPairs(modalContent)
    }
}

export function showModal(id) {
    hydrateModalContent(id)
    getModal().showModal()
}

export function createModal() {
    const node = document.createRange().createContextualFragment(modalHtml)

    return node
}
