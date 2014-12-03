var fs = require('fs');

function getNewPinnHTML() {

	var content;

	fs.readFile('./team-pinndit/pinndit-app/views/newpinn.ejs', 'utf8', function read(err, data) {
		if (err) {
			throw err;
		}
		content = data;
		//console.log(content);
	})
	content;
}
