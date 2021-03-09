if (id != -1) {
    quill.enable(false)
    setEntry(id)
} else {
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
    date.disabled = false
    title.disabled = false
    saveButton.disabled = false
    loading_screen.classList.remove('loading')
}