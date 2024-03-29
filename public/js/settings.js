const lightRadio = document.getElementById('lightRadio')
const darkRadio = document.getElementById('darkRadio')
let selectedRadio = lightRadio.checked ? lightRadio : darkRadio

lightRadio.addEventListener('click', (e) => {
  if (selectedRadio !== lightRadio) {
    const body = document.getElementsByTagName('body')[0]
    body.classList.remove('dark')
    body.classList.add('light')
    selectedRadio = lightRadio
    fetch('/flipTheme')
  }
})

darkRadio.addEventListener('click', (e) => {
  if (selectedRadio !== darkRadio) {
    const body = document.getElementsByTagName('body')[0]
    body.classList.remove('light')
    body.classList.add('dark')
    selectedRadio = darkRadio
    fetch('/flipTheme')
  }
})
