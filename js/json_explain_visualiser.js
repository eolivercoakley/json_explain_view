//Basic json visualizer
//@author - Emmett Coakley
//Converts a .json file into a human-readable GUI format

//You'll need:
//Read in the json file
//Build out the tree, divs for each
//Side panel for extra info...angular.js?

function buildTree(_json){
	
	//Parse the json file
	try{		
		//Yeah, I know I'm using jQuery. For debugging since it's more verbose. Remove this later and just make an eval call.
		_json = $.parseJSON( _json );
	}
	catch (err){		
		console.error("Couldn't load JSON file. The following error occurred: " + err);
		return;
	}
	
	//Build out the tree
	var ul_element = document.createElement('div');
	this.nodeArray = [];
	ul_element.className = "media-list";	
	buildNode(_json,0);
	buildDOMTree(ul_element,this.nodeArray)
	document.body.appendChild(ul_element);
	console.log(nodeArray);
};

//ExplainNode: - Constructor for a ExplainNode object
function ExplainNode(_row, _column){
	this.row = _row;
	this.column = _column;
}

//Build a series of nodes, and attaches them to an element (parentElement)
function buildDOMTree(parentElement, nodeArray){
	for(var i = 0; i < nodeArray.length; i++){
		console.log(nodeArray[i]);
		var ele = document.createElement("div");
		ele.className = "explain_node_text";
		var eleText = document.createElement("p");
		for(key in nodeArray[i]){
			if(Array.isArray(nodeArray[i][key])){
				eleText.innerHTML += key + ": ...<br>";				
			}
			else{
				eleText.innerHTML += key + ": " + nodeArray[i][key] + "<br>";				
			}
		}
		ele.style.left = nodeArray[i].column * 200 +"px";
		ele.style.top = nodeArray[i].row * 100 + "px";
		ele.appendChild(eleText);
		parentElement.appendChild(ele);
	}
}

//_node the node containing elements and the array of subnodes to build out
//depth_level (used for determining spacing)
//row_number
//Basic build function method that generates and appends nodes
function buildNode(_jsonData, depth_level){
	//If this is just an array, keep diving
	if(Array.isArray(_jsonData)){
		for(var key in _jsonData){	
			buildNode(_jsonData[key], depth_level);	
		}	
	}
	else{
		//First grab every (non-array) variable and build out the ExampleNode object
		var newNode = new ExplainNode(0,depth_level);
		for(var key in _jsonData){
			newNode[key] = _jsonData[key];
		}		
		//Calculate the row position based on the previous node's depth
		var previousNodeValDepth;
		this.nodeArray.length == 0 ? previousNodeValDepth = -1 : previousNodeValDepth = this.nodeArray[this.nodeArray.length-1].column;
		if(previousNodeValDepth >= depth_level){
			newNode.row = (this.nodeArray[this.nodeArray.length-1].row + 1);
		}		
		this.nodeArray.push(newNode);		
		//Now, build out the subsequent arrays		
		//First grab every (non-array) variable and build out the ExampleNode object
		for(var key in _jsonData){
			if((Array.isArray(_jsonData[key]) && _jsonData[key].length > 0)){	
				buildNode(_jsonData[key], (depth_level+1));
			}
		}
	}
};

//Init function
window.onload = function(){
	getJSONData("../example_json.json");
};

//XHR Request to get the .json file. Most likely won't need to call this
//later, as the buildTree function will just take in a parsed object.
//For now though, we'll be using it to load data from a pre-existing local file.
function getJSONData(fileName){
	var request = new XMLHttpRequest();
	request.onload = function(evt){
		if(evt.srcElement.status = 200 && evt.srcElement.readyState == 4){
			buildTree(evt.srcElement.response);
		}
	};
	request.open("get", fileName, true);
	request.send();
};
