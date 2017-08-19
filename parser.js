var fs = require('fs');
var parse = require('xml-parser');
var xml = fs.readFileSync('test.xml', 'utf8');
var inspect = require('util').inspect;
 
var obj = parse(xml);

console.log(inspect(obj, {colors: true, depth: Infinity}));

for (i in obj.root.children) {
	var value = obj.root.children[i];
	if (value.name == "steps") {
		for (j in value.children) {
			console.log(value.children[j].attributes.number + " - " + value.children[j].attributes.title)
			var 
			for (k in value.children[j].children) {
				console.log(value.children[j].children[k]);

			}
		}
	}
}