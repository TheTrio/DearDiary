let currentEntry = -1
const setEntry = async (id) => {
  data = entry
  currentEntry = data
  title.value = data.title
  title.innerText = data.title
  date.value = data.date.slice(0, 10)
  simplemde.value(data.markdown)
  document.title = `Diary Entry - ${data.title}`
  const date_label = document.querySelector('#dateText')
  if (date_label)
    date_label.innerHTML = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(data.date))
  if (!isEditablePage()) {
    simplemde.togglePreview()
  }
  const c = document.querySelector(`div[id="${id}"]`)
  c.addEventListener('click', (e) => {
    dustbinClick(c, e)
  })
  c.classList.add('selected')
  if (data.prev !== null && data.prev !== undefined)
    leftNavBtn.querySelector('a').setAttribute('href', `/entry/${data.prev}`)
  if (data.next !== null && data.next !== undefined)
    rightNavBtn.querySelector('a').setAttribute('href', `/entry/${data.next}`)
  setTimeout(() => {
    loading_screen.classList.remove('loading')
    document.getElementsByTagName('body')[0].classList.remove('unscroll')
  }, 1000)
  const { readingTime } = await import(
    'https://cdn.jsdelivr.net/npm/reading-time-estimator@1.7.2/+esm'
  )
  const { text } = readingTime(simplemde.value())
  const readTime = document.querySelector('#readTime')
  if (readTime) readTime.textContent = text
}
