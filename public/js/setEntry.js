let currentEntry = -1
const setEntry = (id) => {
    fetch(`/api/entry/${id}`)
        .then((resp) => {
            if (resp.status === 404) {
                throw new Error('No such entry found')
            } else {
                return resp.json()
            }
        })
        .then(async (data) => {
            currentEntry = data
            title.value = data.title
            contents = data.Delta
            quill.setContents(contents)
            date.value = data.date.slice(0, 10)
            document.title = `Diary Entry - ${data.title}`
            const date_label = document.querySelector('#dateText')
            date_label.innerHTML = new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(new Date(data.date))
            const selected = document.createElement('li')
            selected.insertAdjacentHTML(
                'afterbegin',
                `
                <div class="entry_item" id="${id}">
                    <div>
                        <a href="/entry/${id} ">${data.title}</a>
                    </div>
                    <div id="date_label">
                        ${new Intl.DateTimeFormat('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }).format(new Date(data.date))} 
                    </div>
                </div>
                `
            )
            const c = selected.querySelector(`div[id="${id}"]`)
            c.addEventListener('click', (e) => {
                dustbinClick(c, e)
            })
            c.classList.add('selected')
            current_entry.insertAdjacentElement('afterbegin', selected)
            if (data.prev !== null && data.prev !== undefined)
                leftNavBtn
                    .querySelector('a')
                    .setAttribute('href', `/entry/${data.prev}`)
            if (data.next !== null && data.next !== undefined)
                rightNavBtn
                    .querySelector('a')
                    .setAttribute('href', `/entry/${data.next}`)
            setTimeout(() => {
                loading_screen.classList.remove('loading')
                document
                    .getElementsByTagName('body')[0]
                    .classList.remove('unscroll')
            }, 1000)
            const { readingTime } = await import(
                'https://cdn.jsdelivr.net/npm/reading-time-estimator@1.7.2/+esm'
            )
            const { text } = readingTime(quill.getText())
            const readTime = document.querySelector('#readTime')
            readTime.textContent = text
        })
        .catch((e) => {
            error_message.innerHTML = e.message
            error_screen.classList.add('visible')
            loading_screen.classList.remove('loading')
        })
}
