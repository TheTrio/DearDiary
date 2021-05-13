document.addEventListener('mousemove', (e) => {
    if (
        e.clientX === 0 &&
        screen.height / 2 - 100 <= e.clientY &&
        e.clientY <= screen.height / 2 + 100
    ) {
        if (!leftNavBtn.classList.contains('hover')) {
            leftNavBtn.classList.add('hover')
        }
    } else if (
        e.clientX >= 51 ||
        screen.height / 2 - 100 > e.clientY ||
        e.clientY > screen.height / 2 + 100
    ) {
        if (leftNavBtn.classList.contains('hover')) {
            leftNavBtn.classList.remove('hover')
        }
    }
    if (
        screen.width - e.clientX <= 10 &&
        screen.height / 2 - 100 <= e.clientY &&
        e.clientY <= screen.height / 2 + 100
    ) {
        if (!rightNavBtn.classList.contains('hover')) {
            rightNavBtn.classList.add('hover')
            console.log('working')
        }
    } else if (
        screen.width - e.clientX >= 55 ||
        screen.height / 2 - 100 > e.clientY ||
        e.clientY > screen.height / 2 + 100
    ) {
        if (rightNavBtn.classList.contains('hover')) {
            rightNavBtn.classList.remove('hover')
        }
    }
})
