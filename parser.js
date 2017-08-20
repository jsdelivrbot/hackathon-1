var fs = require('fs')
var parse = require('xml-parser')
var inspect = require('util').inspect

function parseHTML(field, cls, id) {
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
	return '<form id="'+ id +'">' + htmlCard + '<input type="button" value="próximo" onclick="check(' +"'" + cls + "'" + ')"></br>\n</form>\n';
}

/*
<li>
	<div class="collapsible-header" style="border:0">
		<div class="row">
			<div class="col s3">
				<a class="btn-floating btn waves-effect waves-light teal hoverable" href="#title"><b>i</b></a>
			</div>
			<div class="col s8 offset-s1">
				<h5>Resumo</h5>
			</div>
		</div>
	</div>
</li>
*/

function parseProtocol(protocolName) {
	var xml = fs.readFileSync('Protocols/' + protocolName + ".xml", 'utf8')
	 
	var obj = parse(xml)

	//storing cards
	var cards = []
	var sideMenu = ""

	//parse cards from xml
	var cls = 0
	for (i in obj.root.children) {
		var field = obj.root.children[i]
		if (field.name == "steps") {
			for (j in field.children) {
				sideMenu += '<li><div class="collapsible-header" style="border:0"><div class="row"><div class="col s3"><a class="btn-floating btn waves-effect waves-light teal hoverable"><b>' + field.children[j].attributes.number + '</b></a></div><div class="col s8 offset-s1"><h5>' + field.children[j].attributes.title + '</h5></div></div></div>'
				for (k in field.children[j].children) {
					var value = field.children[j].children[k]
					var number = value.attributes.number
					cards.push({'number' : number, 'title' : field.children[j].attributes.title, 'html' : parseHTML(value, cls, number)})
					cls+=1
					sideMenu += '<div class="collapsible-body" style="border:0"><div class="row"><div class="col s3 offset-s4"><a class="btn-floating btn waves-effect waves-light teal hoverable" href="#' + number + '"><b>' + number + '</b></a></div></div></div>'
					//console.log(sideMenu)
				}
				sideMenu += '<li>'
				//cardsHTML.push(parseHTML(field.children[j]))
			}
		}
		else {
			cards.push({'title' : field.attributes.title, 'html' : parseHTML(field, cls, field.name)})
			cls+=1
			if (field.name == "info") {
				sideMenu += '<li><div class="collapsible-header" style="border:0"><div class="row"><div class="col s3"><a class="btn-floating btn waves-effect waves-light teal hoverable" href="#title"><b>i</b></a></div><div class="col s8 offset-s1"><h5>Resumo</h5></div></div></div></li>'
			}
			else if (field.name == "equipaments") {
				sideMenu += '<li><div class="collapsible-header" style="border:0"><div class="row"><div class="col s3"><a class="btn-floating btn waves-effect waves-light teal hoverable" href="#equipaments"><b>i</b></a></div><div class="col s8 offset-s1"><h5>Materiais</h5></div></div></div></li>'
			}
			//cardsHTML.push(parseHTML(field))
		}
	}

	//console.log(cards)
	return [sideMenu, cards]
}

module.exports = {
	parseHTML : parseHTML,
	parseProtocol : parseProtocol
}

console.log(parseProtocol("protocol1"))