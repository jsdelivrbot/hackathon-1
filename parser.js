var fs = require('fs')
var parse = require('xml-parser')
var inspect = require('util').inspect

function parseHTML(field, cls, name) {
	var htmlCard = ""
	for (k in field.children) {
		var content = field.children[k].content
		var attributes = []
		if (field.children[k].attributes.hasOwnProperty("type")) {
			attributes = field.children[k].attributes.type.split(";")
		}
		for (l in attributes) {
			if (attributes[l] == "check") {
				content = '<input class="' + cls + ' ' + field.children[k].attributes.tagname + '" type="checkbox">' + content
			}
			if (attributes[l] == "video") {
				content = '<iframe width="560" height="315" src="' + content + '" frameborder="0" allowfullscreen></iframe>'
			}
			if (attributes[l] == "link") {
				content = '<a href="' + field.children[k].attributes.link + '">' + content + '</a>'
			}
			if (attributes[l] == "file") {
				content = content + ': <input class="' + cls + ' ' + field.children[k].attributes.tagname + '" type="file">'
			}
			if (attributes[l] == "text") {
				content = content + ': <input class="' + cls + ' ' + field.children[k].attributes.tagname + '" type="text">'
			}
		}
		htmlCard += content + '</br>\n';
	}
	//transform into form
	return '<form>\n' + htmlCard + '<input type="button" value="próximo" onclick="check(' +"'" + cls + "'" + ')"></br>\n</form>\n';
}

function parseProtocol(protocolName) {
	var xml = fs.readFileSync('Protocols/' + protocolName + ".xml", 'utf8')
	 
	var obj = parse(xml)

	//storing cards
	var cards = []

	//parse cards from xml
	var cls = 0
	for (i in obj.root.children) {
		var field = obj.root.children[i]
		if (field.name == "steps") {
			for (j in field.children) {
				for (k in field.children[j].children)
				cards.push({'number' : field.children[j].children[k].attributes.number, 'title' : field.children[j].attributes.title, 'html' : parseHTML(field.children[j].children[k], cls)})
				cls++
				//cardsHTML.push(parseHTML(field.children[j]))
			}
		}
		else {
			cards.push({'title' : field.attributes.title, 'html' : parseHTML(field, cls)})
			cls++
			//cardsHTML.push(parseHTML(field))
		}
	}

	console.log(cards)
	return cards
}

module.exports = {
	parseHTML : parseHTML,
	parseProtocol : parseProtocol
}

parseProtocol("protocol1")