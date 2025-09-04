import './style.css'
import menuHtml from './templates/menu.html?raw'
import modalHtml from './templates/modal.html?raw'

document.querySelector('#app').innerHTML = `
  <div id='cgol-container'>
    ${menuHtml}
    ${modalHtml}
    <canvas id='cgol'></canvas>
  </div>
`

const modalContentFiles = import.meta.glob('./templates/menu/*', {
    eager: true,
    as: 'raw',
})
const modalContentByFile = Object.fromEntries(
    Object.entries(modalContentFiles).map(([path, content]) => {
        const filename = path.split('/').pop()
        const name = filename.slice(0, -5) // Remove `.html`

        return [name, content]
    })
)

const modal = document.querySelector('#modal')
const menuBtns = document.querySelectorAll('.menu-btn')
const modalContent = modal.querySelector('#modal-content')

menuBtns.forEach((el) => {
    el.addEventListener('click', () => showModal(el))
})

function showModal(el) {
    const { id } = el
    const filename = id.split('-')[0]

    const template = document.createElement('template')
    template.innerHTML = modalContentByFile[filename] ?? ''

    modalContent.replaceChildren(template.content.cloneNode(true))

    modal.showModal()
}
