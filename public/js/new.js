current_entry.insertAdjacentHTML(`afterbegin`, `
    <li>
        <div class="entry_item">
            <div>
                <a href="#">Unsaved Entry</a>
            </div>
        <div id="date_label">
            ${new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date())}
        </div>
        </div>
    </li>
`)

saveButton.addEventListener('click', () => {
    const chosenDate = new Date(date.value)
    console.log(chosenDate)
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
    } else {
        editor.classList.remove('invalid')
        const Delta = quill.getContents().ops
        console.log(title.value)
        const Entry = {
            username: 'Shashwat',
            Delta: Delta,
            date: chosenDate,
            title: title.value
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Entry)
        }
        fetch('/entry', options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((json) => {

                const date = new Date(json.entry.date)
                console.log(date)
                updateCurrentEntry(json.entry._id, json.entry.title, date)
                const c = current_entry.querySelector(`div[id="${json.entry._id}"]`)
                c.addEventListener('click', (e) => selectEntry(e, c))
                console.log('SAVED ID')
            }).catch((e) => {
                console.log(`Caught error ${e}`)
            })
    }
}
)
loading_screen.classList.remove('loading')