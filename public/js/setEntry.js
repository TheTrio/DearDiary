let currentEntry = -1
const setEntry = (id) => {
    fetch(`/api/entry/${id}`)
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
                        <a href="/entry/${id} ">${data.title}</a>
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
                document.getElementsByTagName('body')[0].classList.remove('unscroll')
            }, 1000)
        })
        .catch((e) => {
            error_message.innerHTML = e.message
            error_screen.classList.add('visible')
            loading_screen.classList.remove('loading')
        })
}