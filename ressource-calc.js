/*jshint multistr: true */
var xml = '<Objects>\
<WoodLog name="Wood Log" basic="true"></WoodLog>\
<ScrapMetal name="Scrap Metal" basic="true"></ScrapMetal>\
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
	<ScrapMetal name="Scrap Metal" amount="2" basic="true"></ScrapMetal>\
</MetalBar>\
<MetalSheet name="Metal Sheet" basic="false">\
	<MetalBar name="Metal Bar" amount="2" basic="false"></MetalBar>\
</MetalSheet>\
<StorageContainer name="Storage Container" basic="false">\
	<WoodPlank name="Wood Plank" amount="6" basic="false"></WoodPlank>\
	<MetalBracket name="Metal Bracket" amount="4" basic="false"></MetalBracket>\
	<Nail name="Nail" amount="4" basic="false"></Nail>\
</StorageContainer>\
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
var xmlDoc = loadXMLDoc("ressources.xml");
var objectNodes = xmlDoc.childNodes[0];
var objectArray = [];
var objectsList = document.getElementById("objectsList");
var materialList = [];

var objectTree = function(objectNodes) {
	for(var i = 0; i < objectNodes.children.length; i++)
	{
		object = objectNodes.children[i];
		if(object.nodeName == "#text") {

		} else {
			objectArray.push([object.getAttribute("name"), object]);
			if(object.hasChildNodes())
			{
				var array = getMaterial(object);
			}
		}
	}
	
};

var getMaterial = function(materials) {
	var woodlog = 0;
	var scrapmetal = 0;
	for (var i = 0; i < materials.children.length; i++) {
		var material = materials.children[i];
		if(material.nodeName == "#text") {

		} else {
			var amount = 0;
			var name = material.getAttribute("name");
			if(material.getAttribute("amount") !== null)
			{
				amount = material.getAttribute("amount");
			}
			if(material.getAttribute("basic") == "false")
			{
				var array = getMaterial(getObjectWithNodeName(name));
				woodlog =  parseFloat(woodlog + ((array[0]  === 0 ? "" : array[0]) * amount));
				scrapmetal =  parseFloat(scrapmetal + ((array[1]  === 0 ? "" : array[1]) * amount));
			}
			else if(material.getAttribute("basic") == "true")
			{
				if(name == "Scrap Metal")
				{
					scrapmetal = parseFloat(scrapmetal + (amount === 0 ? "" : amount));
				}
				if(name == "Wood Log")
				{
					woodlog += parseFloat(woodlog + (amount === 0 ? "" : amount));
				}
			}
		}
	}
	if(!materials.hasChildNodes())
	{
		var new_name = materials.getAttribute("name");
		if(new_name == "Scrap Metal")
		{
			scrapmetal = 1;
		}
		if(new_name == "Wood Log")
		{
			woodlog += 1;
		}
	}
	var matsArray = [woodlog, scrapmetal];
	return matsArray;
};

var getAllMaterial = function(materials) {
	var woodlog = 0;
	var woodplank = 0;
	var woodstick = 0;
	var scrapmetal = 0;
	var metalshard = 0;
	var metalbar = 0;
	var metalbracket = 0;
	var metalsheet = 0;
	var nail = 0;

	for (var i = 0; i < materials.children.length; i++) {
		var material = materials.children[i];
		if(material.nodeName == "#text") {

		} else {
			var amount = 0;
			var name = material.getAttribute("name");
			if(material.getAttribute("amount") !== null)
			{
				amount = material.getAttribute("amount");
			}
			if(true)
			{
				if(name == "Wood Log")
				{
					woodlog += parseFloat(woodlog + (amount === 0 ? "" : amount));
				}
				if(name == "Wood Plank")
				{
					woodplank += parseFloat(woodplank + (amount === 0 ? "" : amount));
				}
				if(name == "Wood Strick")
				{
					woodstick += parseFloat(woodstick + (amount === 0 ? "" : amount));
				}
				if(name == "Scrap Metal")
				{
					scrapmetal = parseFloat(scrapmetal + (amount === 0 ? "" : amount));
				}
				if(name == "Metal Shard")
				{
					metalshard = parseFloat(metalshard + (amount === 0 ? "" : amount));
				}
				if(name == "Metal Bracket")
				{
					metalbracket = parseFloat(metalbracket + (amount === 0 ? "" : amount));
				}
				if(name == "Metal Sheet")
				{
					metalsheet = parseFloat(metalsheet + (amount === 0 ? "" : amount));
				}
				if(name == "Metal Bar")
				{
					metalbar = parseFloat(metalbar + (amount === 0 ? "" : amount));
				}
				if(name == "Nail")
				{
					nail = parseFloat(nail + (amount === 0 ? "" : amount));
				}
			}
		}
	}
	if(!materials.hasChildNodes())
	{
		var new_name = materials.getAttribute("name");
		if(new_name == "Scrap Metal")
		{
			scrapmetal = 1;
		}
		if(new_name == "Wood Log")
		{
			woodlog += 1;
		}
	}
	var matsArray = [woodlog, woodplank, woodstick, scrapmetal, metalshard, metalbracket, metalsheet, metalbar, nail];
	return matsArray;
};

var getObjectWithNodeName = function(name) {
	for(var i = 0; i < objectArray.length; i++)
	{
		if(objectArray[i][0] == name)
		{
			return objectArray[i][1];
		}
	}
	return false;
};

var getLog = function(objectNode) {
	var log = 0;

	return log;
};

var addToList = function(btn) {
	var toAdd = btn.getAttribute("id");
	var amount = 0;
	var pos = 0;
	if($("#currentList > li").size() > 0)
	{
		for (var i = 0; i < $("#currentList > li > #curListName").size(); i++) {
			if(toAdd == $("#currentList > li > #curListName")[i].innerHTML) {
				pos = i;
				amount = $("#currentList > li > #curListAmount")[i].innerHTML;
			}
		}
	}

	if(amount > 0)
	{
		$("#currentList > li > #curListAmount")[pos].innerHTML = parseInt(amount) + 1;
	}
	else
	{
		$("#currentList").append("<li class='list-group-item'><img class='thumb' src='img/" + toAdd + ".png'/><span id='curListAmount'>1</span> x <span id='curListName'>" + toAdd + "</span><button id='" + toAdd + " Sub'class='addBtn' onclick='deleteFromList(this)'>-</button></li>");	
	}
	
	materialList.push(toAdd);
	showMats();
};

var deleteFromList = function(btn) {
	var toDel = btn.getAttribute("id");
	var amount = parseInt(btn.parentNode.childNodes[1].innerHTML);

	if(amount > 1) {
		btn.parentNode.childNodes[1].innerHTML = amount -1;
	} else {
		btn.parentNode.remove();
	}
	var removeThis = toDel.replace(" Sub", "");
	var indexToRemove = materialList.indexOf(removeThis);
	materialList.splice(indexToRemove, 1);
	showMats();
};

var fillList = function() {
	objectArray.sort();
	var length = objectArray.length;

	for(var i = 0; i < length; i++)
	{
		var tooltip = "Materials: ";
		tooltip += "\nWood Log: " + getMaterial(objectArray[i][1])[0];
		tooltip += "\nScrap Metal: "+ getMaterial(objectArray[i][1])[1];
		$("#objectsList").append("<li title='" + tooltip + "' class='list-group-item'><img class='thumb' src='img/" + objectArray[i][0] + ".png'/> " + objectArray[i][0] + "<button id='" + objectArray[i][0] + "'class='addBtn' onclick='addToList(this)'>+</button></li>");
	}
};

var showMats = function() {
	var woodLogs = 0;
	var scrapMetals = 0;

	var woodlog = 0;
	var woodplank = 0;
	var woodstick = 0;
	var scrapmetal = 0;
	var metalshard = 0;
	var metalbar = 0;
	var metalbracket = 0;
	var metalsheet = 0;
	var nail = 0;

	for (var i = 0; i < materialList.length; i++)
	{
		for (var j = 0; j < objectArray.length; j++)
		{
			if(objectArray[j][0] == materialList[i])
			{
				var array = getMaterial(objectArray[j][1]);
				woodLogs = parseFloat(woodLogs + (array[0]  === 0 ? "" : array[0]));
				scrapMetals =  parseFloat(scrapMetals + (array[1]  === 0 ? "" : array[1]));

				var array2 = getAllMaterial(objectArray[j][1]);
				woodlog = parseFloat(woodlog + (array2[0]  === 0 ? "" : array2[0]));
				woodplank = parseFloat(woodplank + (array2[1]  === 0 ? "" : array2[1]));
				woodstick = parseFloat(woodstick + (array2[2]  === 0 ? "" : array2[2]));
				scrapmetal = parseFloat(scrapmetal + (array2[3]  === 0 ? "" : array2[3]));
				metalshard = parseFloat(metalshard + (array2[4]  === 0 ? "" : array2[4]));
				metalbar = parseFloat(metalbar + (array2[5]  === 0 ? "" : array2[5]));
				metalbracket = parseFloat(metalbracket + (array2[6]  === 0 ? "" : array2[6]));
				metalsheet = parseFloat(metalsheet + (array2[7]  === 0 ? "" : array2[7]));
				nail = parseFloat(nail + (array2[8]  === 0 ? "" : array2[8]));

			}
		}
	}
	$("#ergebnis").html("<b>To Farm:</b><br><img class='thumb' src='img/Wood Log.png'/> Wood Logs: <b>" + woodLogs + "</b><br><img class='thumb' src='img/Scrap Metal.png'/> Scrapmetal: <b>" + scrapMetals + "</b><br><br>" +
		"<table id='table'>" + "<tr><th width='50px'></th><th width='150px'>Material</th><th>Amount</th></tr>" +
		"<tr><td><img class='thumb' src='img/Wood Log.png'/></td><td>Wood Logs</td><td>" + woodlog + "</td>" +
		"<tr><td><img class='thumb' src='img/Wood Plank.png'/></td><td>Wood Planks</td><td>" + woodplank + "</td>" +
		"<tr><td><img class='thumb' src='img/Wood Stick.png'/></td><td>Wood Sticks</td><td>" + woodstick + "</td>" +
		"<tr><td><img class='thumb' src='img/Scrap Metal.png'/></td><td>Scrap Metals</td><td>" + scrapmetal + "</td>" +
		"<tr><td><img class='thumb' src='img/Metal Shard.png'/></td><td>Metal Shards</td><td>" + metalshard + "</td>" +
		"<tr><td><img class='thumb' src='img/Metal Bar.png'/></td><td>Metal Bars</td><td>" + metalbar + "</td>" +
		"<tr><td><img class='thumb' src='img/Metal Bracket.png'/></td><td>Metal Brackets</td><td>" + metalbracket + "</td>" +
		"<tr><td><img class='thumb' src='img/Metal Sheet.png'/></td><td>Metal Sheets</td><td>" + metalsheet + "</td>" +
		"<tr><td><img class='thumb' src='img/Nail.png'/></td><td>Nails</td><td>" + nail + "</td>" +
		"</table>");
};

objectTree(objectNodes);
fillList();