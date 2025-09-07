import './style.css'
import { createMenu } from './templates/menu'
import { createModal } from './templates/modal'

const app = document.querySelector('#app')

app.innerHTML = `
  <div id='cgol-container'>
    <canvas id='cgol'></canvas>
  </div>
`

const modal = createModal()
const menu = createMenu()

app.appendChild(modal)
app.appendChild(menu)
