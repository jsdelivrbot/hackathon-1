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
			if (attributes[l] == "video") {
				content = '<div class="video-container"><iframe width="853" height="480" src="' + content + '" frameborder="0" allowfullscreen></iframe></div>'
			}
			if (attributes[l] == "link") {
				content = '<div class="center-align"><a class="waves-effect waves-light btn" href="' + field.children[k].attributes.link + '">' + content + '</a></div>'
			}	
			if (attributes[l] == "check") {
				//content = '<input class="' + cls + ' ' + field.children[k].attributes.tagname + '" type="checkbox">' + content
				if (field.children[k].attributes.hasOwnProperty("amount")) content = '<div class="row"><div class="col s1"><input type="checkbox" class="filled-in ' + cls + ' ' + field.children[k].attributes.tagname + '" id="' + field.children[k].attributes.id + '"/><label for="' + field.children[k].attributes.id + '"></div><div class="col s1">' + field.children[k].attributes.amount + '</div><div class="col s10">' + content + '</div></div>'
				else content = '<div class="row"><div class="col s1"><input type="checkbox" class="filled-in ' + cls + ' ' + field.children[k].attributes.tagname + '" id="' + field.children[k].attributes.id + '"/><label for="' + field.children[k].attributes.id + '"></div><div class="col s1"></div><div class="col s10">' + content + '</div></div>'
			}
			if (attributes[l] == "file") {
				content = content + ': <input class="' + cls + ' ' + field.children[k].attributes.tagname + '" type="file">'
			}
			if (attributes[l] == "text") {
				content = content + ': <input class="' + cls + ' ' + field.children[k].attributes.tagname + '" type="text">'
			}
			if (attributes[l] == "next") {
				content = '<div class="center-align"><a class="waves-effect waves-light btn" onclick="check(' +"'" + cls + "'" + ')">' + content + '</a></div>'
			}
			if (attributes[l] == "line") {
				content = '<div class="row"></div><div class="divider"></div><div class="row"></div>'
			}
			if (attributes[l] == "timer") {
				content = '<div class="row"><div class="col s1 offset-s4 l1"><a class="btn-floating btn waves-effect waves-light red hovarable"><b><i class="material-icons">timer</i></b></a></div><div class="col s11"><p>' + content + '</p></div></div>'
			}
			if (attributes[l] == "warning") {
				content = '<div class="row"><div class="col s1 offset-s4 l1"><a class="btn-floating btn waves-effect waves-light red hovarable"><b><i class="material-icons">warning</i></b></a></div><div class="col s11"><p>' + content + '</p></div></div>'
			}
		}
		if (attributes.length == 0) {
			content = '<p>' + content + '</p>'
		}
		htmlCard += content;
	}
	//transform into form
	return '<div class="card-action">' + htmlCard + '</div>';
}

function parseProtocol(protocolName) {
	var xml = fs.readFileSync('Protocols/' + protocolName + ".xml", 'utf8')
	 
	var obj = parse(xml)

	//storing cards
	var cards = []
	var sideMenu = ""
	var references = ['0', '1']

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
					var title = '<div class="card-content teal white-text"><div class="row"><div class="col s2 l1"><a class="btn-floating btn waves-effect waves-light white teal-text"><b>' + number + '</b></a></div><div class="col s5 offset-s1 l7"><span class="card-title"><strong>' + field.children[j].attributes.title + '<strong></span></div><div class="col s1"><i class="material-icons">add_a_photo</i></div><div class="col s1 offset-s1"><i class="material-icons">keyboard_voice</i></div><div class="col s1 offset-s8"><i class="material-icons">format_color_text</i></div><div class="col s1 offset-s1"><i class="material-icons">question_answer</i></div></div></div>'
					var title = '<div id = "'+cls+'" class="card">' + title
					references.push(cls)
					cards.push({'number' : number, 'title' : field.children[j].attributes.title, 'html' : title + parseHTML(value, cls, number) + '</div>'})
					sideMenu += '<div class="collapsible-body" style="border:0"><div class="row"><div class="col s3 offset-s4"><a class="btn-floating btn waves-effect waves-light teal hoverable" href="#' + cls + '"><b>' + number + '</b></a></div></div></div>'
					cls+=1
					//console.log(sideMenu)
				}
				sideMenu += '<li>'
				//cardsHTML.push(parseHTML(field.children[j]))
			}
		}
		else {
			var text = parseHTML(field, cls, field.name)
			var title
			if (field.name == "info") {
				title = '<div class="card-content teal white-text"><div class="row"><div class="col s2 l1"><a class="btn-floating btn waves-effect waves-light white teal-text"><b>i</b></a></div><div class="col s7 offset-s1 l10 "><span class="card-title"><strong>Overview<strong></span></div></div><div class="row"><div class="col s1"><i class="material-icons">business</i></div><div class="col s2 offset-s1 l2"><b>' + field.attributes.business + '</b></div><div class="col s1 offset-s3 l1"><i class="material-icons">timer</i></div><div class="col s2 offset-s1 l2"><b>' + field.attributes.timer + '</b></div><div class="col s1"><i class="material-icons">remove_red_eye</i></div><div class="col s5 offset-s1 l3"><b>' + field.attributes.views + '</b></div><div class="col s1 l1"><i class="material-icons">star</i></div><div class="col s1 offset-s1 l1"><b>' + field.attributes.stars + '</b></div></div></div>'
				text = '<div id="0" class="card">' + title + text + '</div>'
				sideMenu += '<li><div class="collapsible-header" style="border:0"><div class="row"><div class="col s3"><a class="btn-floating btn waves-effect waves-light teal hoverable" href="#0"><b>i</b></a></div><div class="col s8 offset-s1"><h5>Overview</h5></div></div></div></li>'
			}
			else if (field.name == "equipaments") {
				title = '<div class="card-content teal white-text"><div class="row"><div class="col s2 l1"><a class="btn-floating btn waves-effect waves-light white teal-text"><b>ii</b></a></div><div class="col s7 offset-s1 l10 "><span class="card-title"><strong>Material<strong></span></div></div></div>'
				text = '<div id="1" class="card">' + title + text + '</div>'
				sideMenu += '<li><div class="collapsible-header" style="border:0"><div class="row"><div class="col s3"><a class="btn-floating btn waves-effect waves-light teal hoverable" href="#2"><b>ii</b></a></div><div class="col s8 offset-s1"><h5>Material</h5></div></div></div></li>'
			}
			cards.push({'title' : field.attributes.title, 'html' : text})
			cls+=1
			//cardsHTML.push(parseHTML(field))
		}
	}

	//console.log(cards)
	return [sideMenu, cards, references]
}

module.exports = {
	parseHTML : parseHTML,
	parseProtocol : parseProtocol
}

//console.log(parseProtocol("protocol1"))