var xml = '<Objects>\
<WoodLog name="Wood Log" basic="true">\
</WoodLog>\
<ScrapMetal name="Scrap Metal" basic="true">\
</ScrapMetal>\
<WoodPlank name="Wood Plank" basic="false">\
<WoodLog name="Wood Log" basic="true" amount="0.5"></WoodLog>\
</WoodPlank>\
<WoodStick name="Wood Stick" basic="false">\
<WoodPlank name="Wood Plank" basic="false" amount="1"></WoodPlank>\
</WoodStick>\
<MetalBracket name="Metal Bracket" basic="false">\
<ScrapMetal name="Scrap Metal" amount="1" basic="true"></ScrapMetal>\
</MetalBracket>\
<MetalShard name="Metal Shard" basic="false">\
<ScrapMetal name="Scrap Metal" amount="1" basic="true"></ScrapMetal>\
</MetalShard>\
<Nail name="Nail" basic="false">\
<MetalShard name="Metal Shard" amount="0.25" basic="false"></MetalShard>\
</Nail>\
<MetalBar name="Metal Bar" basic="false">\
<ScrapMetal name="Scrap Metal" amount="2" basic="true">\
</ScrapMetal>\
</MetalBar>\
<MetalSheet name="Meta Sheet" basic="false">\
<MetalBar name="Metal Bar" amount="2" basic="false">\
</MetalBar>\
</MetalSheet>\
</Objects>';

function loadXMLString(txt) 
{
	if (window.DOMParser)
	{
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(txt,"text/xml");
	}
	else // code for IE
	{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(txt); 
	}
	return xmlDoc;
}

function loadXMLDoc(filename)
{
	if (window.XMLHttpRequest)
	{
		xhttp=new XMLHttpRequest();
	}
	else // code for IE5 and IE6
	{
		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET",filename,false);
	xhttp.send();
	return xhttp.responseXML;
}

//var xmlDoc = loadXMLString(xml);
var xmlDoc = loadXmlDoc("ressources.xml");
var objectNodes = xmlDoc.childNodes[0];
var objectArray = [];


var objectTree = function(objectNodes) {
	for(var i = 0; i < objectNodes.childNodes.length; i++)
	{
		object = objectNodes.childNodes[i];
		if(object.nodeName == "#text") {

		} else {
			objectArray.push([object.getAttribute("name"), object]);
			document.write("<p>");
			document.write(object.getAttribute("name"));
			if(object.hasChildNodes())
			{
				for(var j = 0; j < object.childNodes.length; j++)
				{
					var array = getMaterial(object)
					document.write(" || SM: " + array[1] + " WL: " + array[0]);
				}
			}
			else if(object.getAttribute("basic") == "true")
			{
				document.write(" *basic object*");
			}
			document.write("</p>");
		}
	}
	
};

var getMaterial = function(materials) {
	var woodlog = 0;
	var scrapmetal = 0;
	for(var j = 0; j < materials.childNodes.length; j++)
	{
		var material = materials.childNodes[j];
		if(material.nodeName == "#text") {

		} else {
			var amount = 0;
			var name = material.getAttribute("name");
			document.write(" > ");
			if(material.getAttribute("amount") != null)
			{
				amount = material.getAttribute("amount");
				document.write(amount + " x ");
			}
			document.write(name);
			if(material.getAttribute("basic") == "false")
			{
				var array = getMaterial(getObjectWithNodeName(name));
				woodlog +=  parseFloat(woodlog + ((array[0]  == 0 ? "" : array[0]) * amount));
				scrapmetal =  parseFloat(scrapmetal + ((array[1]  == 0 ? "" : array[1]) * amount));
			}
			else if(material.getAttribute("basic") == "true")
			{
				if(name == "Scrap Metal")
				{
					scrapmetal = parseFloat(scrapmetal + (amount == 0 ? "" : amount));
				}
				if(name == "Wood Log")
				{
					woodlog += parseFloat(woodlog + (amount == 0 ? "" : amount));
				}
			}
		}
	}
	var matsArray = [woodlog, scrapmetal];
	return matsArray;
}

var getObjectWithNodeName = function(name) {
	for(var i = 0; i < objectArray.length; i++)
	{
		if(objectArray[i][0] == name)
		{
			return objectArray[i][1];
		}
		console.log(objectArray[i][0]);
	}
	return false;
}

var getLog = function(objectNode) {
	var log = 0;

	return log;
}

objectTree(objectNodes);