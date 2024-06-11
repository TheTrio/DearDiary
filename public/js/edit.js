window.onbeforeunload = () => true
if (id != -1) {
  setEntry(id)
}

simplemde.codemirror.options.readOnly = false

document.querySelector('.exitNow.btn').addEventListener('click', (e) => {
  window.onbeforeunload = null
  window.location = `/entry/${id}`
})
