stopResponsiveTransition();

function stopResponsiveTransition() {
	const leftClass = document.getElementById('left').classList
	const rightClass = document.getElementById('right_pane').classList
	let timer = null;
	window.addEventListener('resize', function () {
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