stopResponsiveTransition();
const hideUserIcon = (e) => {
	console.log('HIDING')
	userIcon.classList.toggle('hide')
}
let triggerHideUserIcon = window.innerWidth <= 700
if (triggerHideUserIcon) {
	hamburger.addEventListener('click', hideUserIcon)
}
function stopResponsiveTransition() {
	const leftClass = document.getElementById('left').classList
	const rightClass = document.getElementById('right_pane').classList
	let timer = null;
	window.addEventListener('resize', function () {
		if (!triggerHideUserIcon && window.innerWidth <= 700) {
			hamburger.addEventListener('click', hideUserIcon)
			triggerHideUserIcon = true
		} else if (triggerHideUserIcon) {
			hamburger.removeEventListener('click', hideUserIcon)
			triggerHideUserIcon = false
		}
		console.log('resizing')
		if (timer) {
			clearTimeout(timer);
			timer = null;
		} else {
			leftClass.add('stop-transition');
			rightClass.add('stop-transition');
		}
		timer = setTimeout(() => {
			leftClass.remove('stop-transition');
			rightClass.remove('stop-transition');
			timer = null;
		}, 100);
	});
}