current_entry.insertAdjacentHTML(
    `afterbegin`,
    `
    <li>
        <div class="entry_item" id="unsaved_entry">
            <div>
                <a href="#">Unsaved Entry</a>
            </div>
        <div id="date_label">
            ${new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(new Date())}
        </div>
        </div>
    </li>
`
)
const c = current_entry.querySelector(`#unsaved_entry`)
c.addEventListener('click', (e) => {
    dustbinClick(c, e)
})

saveButton.addEventListener('click', () => {
    const chosenDate = new Date(date.value)
    if (quill.getText().trim().length === 0) {
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
        const Delta = quill.getContents().ops
        const Entry = {
            username: 'Shashwat',
            Delta: Delta,
            date: chosenDate,
            title: title.value,
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
                const c = current_entry.querySelector(
                    `div[id="${json.entry._id}"]`
                )
                c.addEventListener('click', (e) => {
                    selectEntry(e, c)
                })
                entry_flash.querySelector('.flash_heading').innerHTML =
                    'Entry Saved'
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
setTimeout(() => {
    loading_screen.classList.remove('loading')
    document.getElementsByTagName('body')[0].classList.remove('unscroll')
}, 500)
