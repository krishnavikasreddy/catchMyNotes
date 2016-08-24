/*
  Author:krishna vikas
  License:MIT
  email:krishna.vikasreddy@gmail.com

  NO WARRANTY WHATSO EVER SO DONT BLAME ME.
  FREE AS SUCH IN 'FREEDOM' NOT IN 'FREE PIZZA'!
*/

/*
  This is now designed as a bookmarklet as of now,later on we can convert it into a chrome extension and others.
*/

//asking the page to load our object as it is clicked on


var JQUERY_URL="jquery.min.js";
var BOOTSTRAP_CSS_URL="bootstrap.css";
var JQUERYUI_JS_URL="jquery-ui-1.12.0/jquery-ui.min.js";
var JQUERYUI_CSS_URL="jquery-ui-1.12.0/jquery-ui.min.css";


//Varibles
var notesClassTag="notes-";
var greenClassTag="green-text"


//Notes is the Object we store all our selected data
//As we go on we might increase the requirements of the Notes object
var notesId=0;
var Notes=[];

var NotesObject=function(id,text,ranges){
    this.text=text;
    this.id=id;
    this.ranges=ranges;
}

NotesObject.prototype={
    getElem:function(){
	return document.getElementsByClassName(notesClassTag+this.id);
    },
    
}


function addEvents(){
    var body=document.getElementsByTagName("body")[0];
    body.onmouseup=function(){
	var sel=window.getSelection();
	var selText=sel.toString();
	//Length can varied according to Need
	if(sel.toString().length>2)
	{
	    //
	    notesId++;
	    
	    var sib=sel.anchorNode;
	    var childNodes=[sel.anchorNode];

	    while(!(sib == sel.focusNode))
	    {
		if(sib.nextSibling!=null)
		{
		    sib=sib.nextSibling;
		}
		else
		{
		    sib=sib.parentElement.nextSibling;
		}
		
		var chid=getAllTextNodes(sib);

		childNodes=childNodes.concat(chid);

		var toBreak=false;

		// check if any child nodes is the focus node
		for(var i in chid)
		{
		    if(chid[i]==sel.focusNode)
		    {
			toBreak=true;
		    }
		}

		
		if(toBreak){
		    break;
		}
		
	    }

	    var childRanges=[];
	    //childNodes
	    
	    for(var index in childNodes)
	    {
		var value=childNodes[index];
		var rangeS=document.createRange();
		rangeS.selectNode(value);
		if(value===sel.anchorNode && value===sel.focusNode){
		    rangeS.setStart(value,sel.anchorOffset);
		    rangeS.setEnd(value,sel.focusOffset);
		}
		else if(value===sel.anchorNode){
		    rangeS.setStart(value,sel.anchorOffset);
		    rangeS.setEnd(value,value.length);
		}
		else if(value===sel.focusNode){
		    rangeS.setStart(value,0);
		    rangeS.setEnd(value,sel.focusOffset);
		}
		childRanges.push(rangeS);
	    }
	    
	    
	    //Add the selection to Notes
	    var newNote=new NotesObject(notesId,selText,childRanges);
	    Notes.push(newNote);
	    
	    //unselect the selection so that it does not cause back to back selection 
	    window.getSelection().empty();
	    ColorRanges();
	    
	}    }
}


//This has to go to utilities function

var getAllTextNodes=function(elem,nodes=[]){
    
    if(elem!=null)
    {
	if(elem.nodeType==3)
	{
	    nodes.push(elem);
	}
	else if(elem.nodeType==1){
	    for(var i in elem.childNodes)
	    {
		getAllTextNodes(elem.childNodes[i],nodes);
	    }
	}
    }

    return nodes;
}
var ColorRanges=function(){
    for(var note of Notes){
	var notesId=note.id;
	for(var range of note.ranges)
	{
	    var toSurrond=function(){
		var node=range.cloneContents().childNodes[0];
		if(!node.className)
		{
		    return false;
		}
		else if(node.className.indexOf("green-text")!=-1)
		{
		    return true;
		}
		return false;	
	    }
	    
	    if(!toSurrond())
	    {
		var spanElem=document.createElement("span");
		spanElem.setAttribute("class",greenClassTag+" "+notesClassTag+notesId);
		//add event to the span to delete it
		range.surroundContents(spanElem);
	    }
	}
    }
}


var unColorRanges=function(notesId){
    for(var i in notesId)
    {
	$(".notes-"+notesId[i]).contents().unwrap();
    }
}

//TODO: DB Name has to be changed

var DB={
    showMenu:function(){
	var menu=$("<div>"+DB.prop.menu.contents+"</div>");
	$(menu).addClass(DB.prop.menu.className);
	$("html").append(menu);
	$(menu).click(function(){
	    DB.showContainer();
	    $(".notes-view").dialog({
		css:{overflow:"visible"},
		resizable: false,
		height: "auto",
		width:"auto",
		modal: true,
		buttons: {
		    "Delete all": function() {
			DB.deleteContainerContents();
		    },
		    Cancel: function() {
			$( this ).dialog( "close" );
		    }
		}
	    });
	});
    },

    showContainer:function(){
	var container=$(".notes-view");
	$(container).html("");
	$.each(Notes,(index,note)=>{
	    $(container).append("<div class='row notes-item'><div class='col-xs-12'>"+note.text+"</div></div>");
	})
	    
	    },

    deleteContainerContents:function(){
	$(".notes-view").html("");
	Notes=[];
    }
};



DB.prop={
    menu:{
	container:"div",
	display:true,
	contents:"Notes",
	className:"btn btn-primary notes-btn"
    },
    contents:function(){
	
    }
};





(function(obj){
    // this is where the script begins
    // like the constructor

    

    if(!window.jQuery)
    {
	var script = document.createElement('script');
	script.type = "text/javascript";
	script.src = JQUERY_URL;

	script.onload=function(){
	    $("head").append("<link rel='stylesheet' type='text/css' href='"+BOOTSTRAP_CSS_URL+"' />");
	    $("head").append("<link rel='stylesheet' type='text/css' href='"+JQUERYUI_CSS_URL+"' />");
	    //DB.showMenu();
	};


	document.getElementsByTagName('head')[0].appendChild(script);
    }
    else{
	
	$("head").append("<link rel='stylesheet' type='text/css' href='"+BOOTSTRAP_CSS_URL+"' />");
	DB.showMenu();
	addEvents();
    }
    
})();




