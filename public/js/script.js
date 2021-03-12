Quill.register('modules/counter', function (quill, options) {
    var container = document.querySelector(options.container);
    quill.on('text-change', function () {
        var text = quill.getText();
        if (options.unit === 'word') {
            container.innerText = text.split(/\s+/).length - 1 + ' words';
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
const a_tags = document.getElementsByTagName('a')
const error_screen = document.getElementById('error_screen')
const error_btn = document.getElementsByClassName('error_btn')[0]
const error_message = document.getElementById('error_screen_text')
const loading_screen = document.getElementById('loading_screen')
const hamburger = document.getElementsByClassName('hamburger')[0]
const leftPane = document.getElementById('left')
const bar = document.getElementsByClassName('left_bar')[0]
const content = document.getElementById('content')

error_btn.addEventListener('click', (e) => {
    window.location = "/entry/new";
})

hamburger.addEventListener('click', (e) => {
    leftPane.classList.toggle('moveRight')
    bar.classList.toggle('moveRight')
    content.classList.toggle('scrollable')
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
                    'Content-Type': 'application/json'
                }
            }
            fetch(`/entry/${entry.id
                }`, options)
                .then((resp) => resp.text())
                .then((data) => {
                    entry.parentElement.remove()
                    window.location = "/entry/new";
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
    console.log('runnig again')
    current_entry.innerHTML = ''

    current_entry.insertAdjacentHTML('afterbegin', `<li>
                <div class="entry_item selected" id="${id}">
                    <div>
                        <a href="/entry/${id}">${title} </a>
                    </div>
                    <div id="date_label">
                        ${new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date)}
                    </div>
                </div>
        </li> `)

}

// delete_entry.addEventListener('click', (e) => {
//     const options = {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }
//     const chosen_items = document.querySelectorAll('.chosen')
//     for (let chosen_item of chosen_items) {
//         fetch(`/ entry / ${ chosen_item.id } `, options)
//             .then((resp) => resp.text())
//             .then((data) => {
//                 console.log(data)
//                 console.log(chosen_item.parentElement)
//                 chosen_item.parentElement.remove()
//                 delete_entry.classList.remove('visible')
//                 delete_entry.classList.add('not_visible')
//                 selectedItems = 0;
//                 window.location = "/entry/new";
//             })
//     }

// })
date.value = (new Date()).toISOString().slice(0, 10)


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
                    const c = current_entry.querySelector(`div[id = "${json.entry._id}"]`)
                    id = json.entry._id
                    console.log('SAVED ID')
                }).catch((e) => {
                    console.log(`Caught error ${e} `)
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
            fetch(`/ entry / ${id} `, options).then(resp => resp.text()).then(d => {
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