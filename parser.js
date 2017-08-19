var fs = require('fs')
var parse = require('xml-parser')
var xml = fs.readFileSync('test.xml', 'utf8')
var inspect = require('util').inspect
 
var obj = parse(xml)

//Function that creates HTML card from JSON info
function parseHTML(field) {
	var htmlCard = ""
	for (k in field.children) {
		var content = field.children[k].content
		var attributes = []
		if (field.children[k].attributes.hasOwnProperty("type")) {
			attributes = field.children[k].attributes.type.split(";")
		}
		for (l in attributes) {
			if (attributes[l] == "check") {
				content = '<input type="checkbox">' + content + ''
			}
			if (attributes[l] == "video") {
				content = '<iframe width="560" height="315" src="' + content + '" frameborder="0" allowfullscreen></iframe>'
			}
			if (attributes[l] == "link") {
				content = '<a href="' + field.children[k].attributes.link + '">' + content + '</a>'
			}
		}
		htmlCard += content + '</br>\n';
	}
	//transform into form
	return '<form>\n' + htmlCard + '<input type="submit" value="Próximo"></br>\n</form>\n';
}

//storing cards
var cards = []

//parse cards from xml
for (i in obj.root.children) {
	var field = obj.root.children[i]
	if (field.name == "steps") {
		for (j in field.children) {
			cards.push(parseHTML(field.children[j]))
		}
	}
	else {
		cards.push(parseHTML(field))
	}
}

console.log(cards)