import { showModal } from './modal'
import menuHtml from './menu.html?raw'

export function createMenu() {
    const node = document.createRange().createContextualFragment(menuHtml)
    const menuButtons = node.querySelectorAll('.menu-btn')

    menuButtons.forEach((el) => {
        el.addEventListener('click', () => {
            const { id } = el
            const filename = id.split('-')[0]

            showModal(filename)
        })
    })

    return node
}
