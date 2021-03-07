Quill.register('modules/counter', function (quill, options) {
    var container = document.querySelector(options.container);
    quill.on('text-change', function () {
        var text = quill.getText();
        if (options.unit === 'word') {
            container.innerText = text.split(/\s+/).length - 2 + ' words';
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
const current_entry = document.getElementById('current_entry')
const editor = document.getElementById('editor')
const date = document.getElementById('date')
const entry_items = document.getElementsByClassName('entry_item')
const delete_entry = document.getElementById('delete_entry')
const a_tags = document.getElementsByTagName('a')
const error_screen = document.getElementById('error_screen')
const error_btn = document.getElementsByClassName('error_btn')[0]
const error_message = document.getElementById('error_screen_text')
const loading_screen = document.getElementById('loading_screen')
const hamburger = document.getElementsByClassName('hamburger')[0]

error_btn.addEventListener('click', (e) => {
    window.location = "/";
})

hamburger.addEventListener('click', (e) => {
    hamburger.classList.toggle('selected')
})
const updateCurrentEntry = (id, title, date) => {
    console.log('runnig again')
    current_entry.innerHTML = ''

    current_entry.insertAdjacentHTML('afterbegin', `<li>
            <div class="entry_item selected" id="${id}">
                <div>
                    <a href="/?id=${id}">${title} </a>
                </div>
                <div id="date_label">
                    ${new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date)}
                </div>
            </div>
        </li>`)
}

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
        console.log(chosen_item.parentElement)
        chosen_item.parentElement.remove()
        delete_entry.classList.remove('visible')
        delete_entry.classList.add('not_visible')
        selectedItems = 0;
        window.location = "/";
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
        if (selectedItems >= 1) {
            if (!delete_entry.classList.contains('visible')) {
                delete_entry.classList.remove('deleted')
                delete_entry.classList.toggle('not_visible')
                delete_entry.classList.toggle('visible')
            }
        } else {
            if (delete_entry.classList.contains('visible')) {
                delete_entry.classList.remove('visible')
                delete_entry.classList.add('not_visible')
                setTimeout(() => {
                    delete_entry.classList.add('deleted')
                    console.log('ADDED DELETE')
                }, 450)
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
            if (isIncluded) {
                const selected = document.getElementById(id)
                selected.classList.add('selected')
                selected_li = selected.parentElement
                selected.parentElement.remove()
                current_entry.insertAdjacentElement('afterbegin', selected_li)
            } else {
                console.log(data.date.slice(0, 10))
                const selected = document.createElement('li')
                selected.insertAdjacentHTML('afterbegin', `
                <div class="entry_item" id="${id}">
                    <div>
                        <a href="/?id=${id} ">${data.title}</a>
                    </div>
                    <div id="date_label">
                        ${new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(data.date))} 
                    </div>
                </div>
                `)
                const c = selected.querySelector(`div[id="${id}"]`)
                c.classList.add('selected')
                c.addEventListener('click', (e) => selectEntry(e, c))
                current_entry.insertAdjacentElement('afterbegin', selected)
            }
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
else {
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
    loading_screen.classList.remove('loading')
}


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
                    updateCurrentEntry(json.entry._id, json.entry.title, date)
                    const c = current_entry.querySelector(`div[id="${json.entry._id}"]`)
                    c.addEventListener('click', (e) => selectEntry(e, c))
                    id = json.entry._id
                    console.log('SAVED ID')
                }).catch((e) => {
                    console.log(`Caught error ${e}`)
                })
        } else {
            console.log('running')
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Entry)
            }
            fetch(`/entry/${id}`, options).then(resp => resp.text()).then(d => {
                console.log(d)
                if (d === 'DONE!') {
                    updateCurrentEntry(id, Entry.title, Entry.date)
                }
            })
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