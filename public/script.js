Quill.register('modules/counter', function (quill, options) {
    var container = document.querySelector(options.container);
    quill.on('text-change', function () {
        var text = quill.getText();
        if (options.unit === 'word') {
            container.innerText = text.split(/\s+/).length + ' words';
        } else {
            container.innerText = text.length + ' characters';
        }
    });
});

var quill = new Quill('#editor', {
    modules: {
        counter: {
            container: '#words',
            unit: 'word'
        },
        toolbar: true
    },
    theme: 'snow',
    scrollingContainer: '#textbox',
    placeholder: 'Your Entry goes here'
});



const saveButton = document.getElementsByClassName('saveNow')[0]
const title = document.getElementById('title')
const entry_list = document.getElementById('entry_list')
const editor = document.getElementById('editor')
const date = document.getElementById('date')
const entry_items = document.getElementsByClassName('entry_item')
const delete_entry = document.getElementById('delete_entry')
const a_tags = document.getElementsByTagName('a')
const error_screen = document.getElementById('error_screen')
const error_btn = document.getElementsByClassName('error_btn')[0]
const error_message = document.getElementById('error_screen_text')
const loading_screen = document.getElementById('loading_screen')

error_btn.addEventListener('click', (e) => {
    window.location = "/";
})

delete_entry.addEventListener('click', (e) => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const chosen_items = document.querySelectorAll('.chosen')
    for (let chosen_item of chosen_items) {
        fetch(`/entry/${chosen_item.id}`, options)
            .then((resp) => resp.text())
            .then((data) => {
                console.log(data)
            })
        chosen_item.classList.add('deleted')
        delete_entry.classList.remove('visible')
        delete_entry.classList.add('not_visible')
    }

})
let selectedItems = 0
function selectEntry(e, entry) {
    if (entry === undefined) {
        entry = e.target
    }
    if ((entry.querySelector('a') === e.target)) {
        console.log('SAD STUFF')
    } else {
        if (entry.classList.contains('chosen')) {
            selectedItems--;
        } else {
            selectedItems++;
        }
        entry.classList.toggle('chosen')
        if (selectedItems >= 2) {
            if (!delete_entry.classList.contains('visible')) {
                delete_entry.classList.toggle('not_visible')
                delete_entry.classList.toggle('visible')
            }
        } else {
            if (delete_entry.classList.contains('visible')) {
                delete_entry.classList.remove('visible')
                delete_entry.classList.add('not_visible')
            }
        }
    }
}
for (let entry of entry_items) {
    entry.addEventListener('click', (e) => selectEntry(e, entry))
}

date.value = (new Date()).toISOString().slice(0, 10)
let currentEntry = -1
const setEntry = (id) => {
    fetch(`/entry/${id}`)
        .then((resp) => {
            if (resp.status === 404) {
                console.log(resp)
                throw new Error('No such entry found')
            } else {
                return resp.json()
            }
        })
        .then((data) => {
            currentEntry = data
            title.value = data.title
            contents = data.Delta
            quill.setContents(contents)
            date.value = data.date.slice(0, 10)
            document.title = `Diary Entry - ${data.title}`
            const selected = document.getElementById(id)
            selected.classList.add('selected')
            selected_li = selected.parentElement
            selected.parentElement.remove()
            console.log(selected_li)
            entry_list.insertAdjacentElement('afterbegin', selected_li)
            setTimeout(() => {
                loading_screen.classList.remove('loading')
            }, 500)
        })
        .catch((e) => {
            error_message.innerHTML = e.message
            error_screen.classList.add('visible')
            loading_screen.classList.remove('loading')
        })
}


title.addEventListener('keyup', () => {
    if (title.value.length > 0) {
        if (title.classList.contains('invalid')) {
            title.classList.remove('invalid')
            title.classList.add('valid')
        }
    }
})

if (id != -1) setEntry(id)
else loading_screen.classList.remove('loading')


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
        if (id === -1) {
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
                    entry_list.insertAdjacentHTML('afterbegin', `<li>
            <div class="entry_item selected" id="${json.entry._id}">
                <div>
                    <a href="/?id=${json.entry._id}">${json.entry.title} </a>
                </div>
                <div id="date_label">
                    ${new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date)}
                </div>
            </div>
        </li>`)
                    const c = entry_list.querySelector(`div[id="${json.entry._id}"]`)
                    c.addEventListener('click', (e) => selectEntry(e, c))
                }).catch((e) => {
                    console.log(`Caught error ${e}`)
                })
        } else {
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Entry)
            }
            console.log(currentEntry.Delta == Entry.Delta)
            fetch(`/entry/${id}`, options)
        }
    }
})
quill.on('text-change', function (delta, oldDelta, source) {
    console.log(delta)
    if (editor.classList.contains('invalid')) {
        editor.classList.remove('invalid')
        editor.classList.add('valid')
    }
});