simplemde.codemirror.options.readOnly = false
const c = current_entry.querySelector(`#unsaved_entry`)

saveButton.addEventListener('click', () => {
  const chosenDate = new Date(date.value)
  if (simplemde.value().trim().length === 0) {
    editor.classList.remove('valid')
    editor.classList.add('invalid')
    editor.classList.add('big')
    setTimeout(() => {
      editor.classList.remove('big')
    }, 500)
  } else if (title.value.length === 0) {
    title.classList.remove('valid')
    title.classList.add('invalid')
    title.classList.add('big')
    setTimeout(() => {
      title.classList.remove('big')
    }, 500)
  } else if (id === -1) {
    editor.classList.remove('invalid')
    const Entry = {
      username: 'Shashwat',
      date: chosenDate,
      title: title.value,
      markdown: simplemde.value(),
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Entry),
    }
    fetch('/entry', options)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }
        return res.json()
      })
      .then((json) => {
        const date = new Date(json.entry.date)
        updateCurrentEntry(json.entry._id, json.entry.title, date)
        const c = current_entry.querySelector(`div[id="${json.entry._id}"]`)
        c.addEventListener('click', (e) => {
          selectEntry(e, c)
        })
        entry_flash.querySelector('.flash_heading').innerHTML = 'Entry Saved'
        entry_flash.classList.remove('dismissed')
        entry_flash.classList.add('visible')
        setTimeout(() => {
          entry_flash.classList.remove('visible')
          entry_flash.classList.add('dismissed')
        }, 5000)
        id = json.entry._id
      })
      .catch((e) => {
        console.log(`Caught error ${e}`)
      })
  }
})
