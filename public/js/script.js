function isEditablePage() {
  if (location.href.includes('edit') || location.href.includes('new')) {
    return [
      'bold',
      'italic',
      'heading',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      '|',
      'link',
      'image',
      'table',
      'horizontal-rule',
      '|',
      'side-by-side',
      'fullscreen',
      '|',
      'guide',
    ]
  }
  return false
}

const simplemde = new SimpleMDE({
  element: document.getElementById('markdownEditor'),
  spellChecker: false,
  toolbar: isEditablePage(),
})

if (isEditablePage()) {
  document.querySelector('html').classList.add('edit')
}
simplemde.codemirror.options.readOnly = true
simplemde.codemirror.options.nocursor = true
const flashDismissButton = document.getElementsByClassName('dismiss')[0]
const saveButton = document.getElementsByClassName('saveNow')[0]
const title = document.getElementById('title')
const entry_list = document.getElementById('entry_list')
const current_entry = document.getElementById('current_entry')
const editor = document.getElementById('markdownEditor')
const date = document.getElementById('date')
const entry_items = document.getElementsByClassName(
  '#current_entry .entry_item'
)
const a_tags = document.getElementsByTagName('a')
const error_screen = document.getElementById('error_screen')
const error_btn = document.getElementsByClassName('error_btn')[0]
const error_message = document.getElementById('error_screen_text')
const loading_screen = document.getElementById('loading_screen')
const hamburger = document.getElementsByClassName('hamburger')[0]
const leftPane = document.getElementById('left')
const bar = document.getElementsByClassName('top_bar')[0]
const content = document.getElementById('content')
const unsaved_entry = document.getElementById('unsaved_entry')
const userIcon = document.getElementById('userIcon')
const right_pane = document.getElementById('right_pane')
const entry_flash = document.getElementById('entry_flash')
const leftNavBtn = document.getElementById('leftNavBtn')
const rightNavBtn = document.getElementById('rightNavBtn')

flashDismissButton.addEventListener('click', (e) => {
  entry_flash.classList.add('dismissed')
})

error_btn.addEventListener('click', (e) => {
  window.location = '/entry/new'
})

userIcon.addEventListener('click', (e) => {
  right_pane.classList.toggle('moveLeft')
  leftPane.classList.remove('moveRight')
  bar.classList.remove('moveRight')
})

hamburger.addEventListener('click', (e) => {
  leftPane.classList.toggle('moveRight')
  bar.classList.toggle('moveRight')
  content.classList.toggle('scrollable')
  right_pane.classList.remove('moveLeft')
  for (let item of entry_items) {
    item.classList.toggle('showDustbin')
  }
  document.getElementsByTagName('body')[0].classList.toggle('unscroll')
})

const dustbinClick = (entry, e) => {
  if (e.offsetX > entry.offsetWidth) {
    if (confirm('Are you sure you want to delete this entry?')) {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      fetch(`/entry/${entry.id}`, options)
        .then((resp) => resp.text())
        .then((data) => {
          entry.parentElement.remove()
          window.location = '/entry/new'
        })
    }
  }
}
for (let entry of entry_items) {
  entry.addEventListener('click', (e) => {
    dustbinClick(entry, e)
  })
}
const updateCurrentEntry = (id, title, date) => {
  current_entry.innerHTML = ''

  current_entry.insertAdjacentHTML(
    'afterbegin',
    `<li>
                <div class="entry_item selected" id="${id}">
                    <div>
                        <a href="/entry/${id}">${title} </a>
                    </div>
                    <div id="date_label">
                        ${new Intl.DateTimeFormat('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }).format(date)}
                    </div>
                </div>
        </li> `
  )
  const c = current_entry.querySelector(`div[id="${id}"]`)
  c.addEventListener('hover', (e) => {
    dustbinClick(c, e)
  })
}
date.value = new Date().toISOString().slice(0, 10)

title.addEventListener('keyup', () => {
  if (title.value.length > 0) {
    if (title.classList.contains('invalid')) {
      title.classList.remove('invalid')
      title.classList.add('valid')
    }
  }
})

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
  } else if (id !== -1) {
    editor.classList.remove('invalid')
    const Entry = {
      date: chosenDate,
      title: title.value,
      markdown: simplemde.value(),
    }
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Entry),
    }
    fetch(`/entry/${id}`, options)
      .then((resp) => resp.text())
      .then((d) => {
        console.log(d)
        entry_flash.querySelector('.flash_heading').innerHTML = 'Entry Saved'
        entry_flash.classList.remove('dismissed')
        entry_flash.classList.add('visible')
        setTimeout(() => {
          entry_flash.classList.remove('visible')
          entry_flash.classList.add('dismissed')
        }, 5000)
        if (d === 'DONE!') {
          updateCurrentEntry(id, Entry.title, Entry.date)
        }
      })
  }
})
