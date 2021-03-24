module.exports = (err, req, res, next) => {
	const { status = 500, name = 'Something went wrong' } = err
	console.log('OOPS')
	const paragraphs = [
		'We were unable to find an entry with this URL. Try checking the URL to see if its valid.',
		'Note: You may also reach this page if you try to access a deleted entry'
	]
	res.status(status).render('error', { status, name, paragraphs })
}