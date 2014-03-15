//Basic json visualizer
//@author - Emmett Coakley
//Converts a .json file into a human-readable GUI format

//You'll need:
//Read in the json file
//Build out the tree, divs for each
//Side panel for extra info...angular.js?

var buildTree = function(_json){
	
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
	console.log(_json);
	var ul_element = document.createElement('ul');
	ul_element.className = "media-list";	
	console.log(ul_element);	
	buildNode(ul_element,_json,0,0);
	document.body.appendChild(ul_element);
};

//_node the node containing elements and the array of subnodes to build out
//depth_level (used for determining spacing)
//row_number

	/**
	 * Bootstrap Structure:
	 * 
	 * /ui/
	 * --Media Element
	 * ----<a> (link)
	 * ---------(image)
	 * ----Media Body
	 * ------Heading(text)
	 * ------Media Element(More)
	 */
/**
var buildNode = function(_node, depth_level, row){
	
	
	
	//Build variables
	var node = document.createElement('div'); //New node object
	var node_resize_link = document.createElement('a'); //Div containing the resize button
	var node_resize_image = document.createElement('img'); //Div containing the resize button image	
	var node_text = document.createElement('h4'); //Div containing the node text
	var node_media_body = document.createElement('div'); //Div to hold the heading and next node
	var row_val = 0;
	
	//Set classnames of divs
	node_media_body.className = "media-body";	
	node_resize_image.className = "resize_image";	
	node_resize_link.className = "pull-left";
	node.className = "media";
	node_text.className = "media-heading";	
	
	for(var key in _node){
		if(typeof _node[key] === "object"){
			node_text.innerHTML += key + ": [...] " + "<br>";	
			node_text.innerHTML += "depth_level" + ": " + depth_level + "<br>";	
			//Skip over the in-between array
			//for(key_val in _node[key]){
			//	node.appendChild(buildNode(_node[key][key_val], (depth_level+1), key_val));				
			//}
			node_media_body.appendChild(buildNode(_node[key], (depth_level+1), key));			
		}
		else{
			node[key] = _node[key];
			node_text.innerHTML += key + ": " + _node[key] + "<br>";		
		}
	}
	node_resize_link.appendChild(node_resize_image);
	node_media_body.insertBefore(node_text,node_media_body.firstChild);
	node.insertBefore(node_media_body,node.firstChild);
	node.insertBefore(node_resize_link,node.firstChild);	
	return node;	
};*/


//_node the node containing elements and the array of subnodes to build out
//depth_level (used for determining spacing)
//row_number
//Basic build function method that generates and appends nodes
function buildNode(parent_node, _jsonData, depth_level, row){	
		
	//Build variables
	if(!Array.isArray(_jsonData)){
		var node = document.createElement('div'); //New node object
		var node_text = document.createElement('h4'); //New node object
		var row_val = 0;
		
		//Set classnames of divs
		node_text.className = "explain_node_text";	
		node_text.style.left = (depth_level * 50) + "px";		
	}
	else{
		var node = parent_node;
		depth_level--;
	}
	
	console.log(_jsonData);
	
	for(var key in _jsonData){
		if(typeof _jsonData[key] === "object"){
			if(typeof node_text != "undefined"){
				node_text.innerHTML += key + ": [...] " + "<br>";					
			}
			if(!Array.isArray(_jsonData[key]) || (Array.isArray(_jsonData[key]) && _jsonData[key].length > 0)){
				buildNode(node,_jsonData[key], (depth_level+1), key);
			}
		}
		else{
			node[key] = _jsonData[key];
			node_text.innerHTML += key + ": " + _jsonData[key] + "<br>";	
		}
	}
	if(!Array.isArray(_jsonData)){		
		node_text.innerHTML += "depth_level" + ": " + depth_level + "<br>";	
		node.insertBefore(node_text,node.firstChild);
		parent_node.appendChild(node);
	}
};



//Init function
window.onload = function(){
	getJSONData("../example_json.json");
};

//XHR Request to get the .json file. Most likely won't need to call this
//later, as the buildTree function will just take in a parsed object.
//For now though, we'll be using it to load data from a pre-existing local file.
var getJSONData = function(fileName){
	var request = new XMLHttpRequest();
	request.onload = function(evt){
		if(evt.srcElement.status = 200 && evt.srcElement.readyState == 4){
			buildTree(evt.srcElement.response);
		}
	};
	request.open("get", fileName, true);
	request.send();
};
