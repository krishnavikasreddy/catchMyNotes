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


// var JQUERY_URL="jquery.min.js";
// var BOOTSTRAP_CSS_URL="bootstrap/css/bootstrap.css";
// var JQUERYUI_JS_URL="jquery-ui-1.12.0/jquery-ui.min.js";
// var JQUERYUI_CSS_URL="jquery-ui-1.12.0/jquery-ui.min.css";

var JQUERY_URL="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js";
var BOOTSTRAP_CSS_URL="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
var JQUERYUI_JS_URL="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js";
var JQUERYUI_CSS_URL="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css";


//Varibles
var notesClassTag="notes-";
var greenClassTag="green-text";


//Notes is the Object we store all our selected data
//As we go on we might increase the requirements of the Notes object

/*
  Notes:
  id : Unique Id for every Chunk of text
  text : Src of the Text
  ranges : this is the document.range id,needed to color it
  top : top location of the text
  left : left location of the text
*/


var NotesObject=function(id,text,ranges,top,left){
    this.text=text;
    this.id=id;
    this.ranges=ranges;
    this.top=top;
    this.left=left;
}

//TODO: Relocate this object
NotesObject.prototype={
    getElem:function(){
	return document.getElementsByClassName(notesClassTag+this.id);
    },
    
};


//TODO:RELOCATE 
var notesId=0;

//Array of all our Notes Objects
var Notes=[];

//return id of selected Notes
Notes.getAllId=function(){
    return  this.map(function(elem){
	return elem.id;
    });
};

//remove particular element in the Notes
Notes.removeItem=function(id){
    this.splice(this.findIndex(function(elem){
	return elem.id==id;
    }),1);
};

//sort the Item according to Top and Left of the text
Notes.sortItems = function(a,b){
    if(a.top < b.top)
    {
	return -1;
    }
    else if(a.top > b.top)
    {
	return 1;
    }
    else if(a.top == b.top){
	
	if(a.left < b.left){
	    return -1;
	}
	else if(a.left > b.left)
	{
	    return 1;
	}
	else
	{
	    return 0;
	}
    }
};


function addEvents(){

    //RElocate this function into UTILITIES
    body.onmouseup=function(){Utility.textSelectionTool();}

    
}


var body=document.getElementsByTagName("body")[0];

var Utility={
    
    textSelectionTool:function(){
	var sel=window.getSelection();
	
	//Length can varied according to Need
	if(sel.toString().length>2)
	{
	    var rangeParent=sel.getRangeAt(0);
	    var boundingRect=rangeParent.getBoundingClientRect();	
	    var selText=sel.toString();
	    //assign a Unique Id
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
		
		var chid=Utility.getAllTextNodes(sib);

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
	    var newNote=new NotesObject(notesId,selText,childRanges,boundingRect.top,boundingRect.left);
	    Notes.push(newNote);
	    
	    //unselect the selection so that it does not cause back to back selection 
	    window.getSelection().empty();
	    Utility.colorRanges();
	    
	} 
	
    },
    getAllTextNodes:function(elem,nodes=[]){
	
	if(elem!=null)
	{
	    if(elem.nodeType==3)
	    {
		nodes.push(elem);
	    }
	    else if(elem.nodeType==1){
		for(var i in elem.childNodes)
		{
		    Utility.getAllTextNodes(elem.childNodes[i],nodes);
		}
	    }
	}

	return nodes;
    },

    colorRanges:function(){
	for(var note of Notes){
	    var notesId=note.id;
	    for(var range of note.ranges)
	    {
		var toSurrond=function(){
		    var node=range.cloneContents().childNodes[0];
		    if(node){
			if(!node.className)
			{
			    return false;
			}
			else if(node.className.indexOf(greenClassTag)!=-1)
			{
			    return true;
			}
			return false;
		    }	
		}
		
		if(!toSurrond())
		{
		    var spanElem=document.createElement("span");
		    spanElem.setAttribute("class",greenClassTag+" "+notesClassTag+notesId);
		    //spanElem.setAttribute("title","Hello world");

		    // $(spanElem).tooltip({
		    // 	position:{ my: "top-2%", at: "bottom"},
		    // 	track:false,
		    // 	close: function(event, ui)
		    // 	{
		    // 	    //hover tip to stay active
		    // 	    // ui.tooltip.hover(function()
		    // 	    // 		 {
		    // 	    // 		     $(this).stop(true).fadeTo(400, 1); 
		    // 	    // 		 },
		    // 	    // 		 function()
		    // 	    // 		 {
		    // 	    // 		     $(this).fadeOut('400', function()
		    // 	    // 				     {
		    // 	    // 					 $(this).remove();
		    // 	    // 				     });
		    // 	    // 		 });
		    // 	}
			
		    // });
		    //add event to the span to delete it
		    range.surroundContents(spanElem);
		}
	    }
	}
    },
    unColorRanges:function(notesId){
	if(!(notesId instanceof Array))
	{
	    notesId=[notesId];
	}
	for(var i in notesId)
	{
	    $(".notes-"+notesId[i]).contents().unwrap();
	}
    }
    
};


var MenuBar={
    prop:{
	menu:{
	    container:"div",
	    display:true,
	    contents:"Notes",
	    className:"btn btn-primary notes-btn"
	}
    },
    showMenu:function(){
	var menu=$("<div>"+this.prop.menu.contents+"</div>");
	$(menu).addClass(this.prop.menu.className);
	$("html").append(menu);
	$(menu).click(MenuBar.events.click);
    },
    events:{
	click:function(){
	    Container.showContainer();
	    $("."+Container.props.css.containerClass).dialog({
		css:{overflow:"visible"},
		resizable: true,
		width:"600px",
		modal: true,
		buttons: {
		    "Delete all": function() {
			Container.deleteContainerContents();
		    },
		    //copies the current selected notes into your clipboard
		    Copy: function(e) {
			var selection=window.getSelection();
			selection.removeAllRanges();
			var range=document.createRange();
			range.selectNode($(".notes-view")[0]);
			selection.addRange(range);
			try{
			    document.execCommand("copy");
			}
			catch(e){
			    console.log(e);
			}
			selection.empty();
		    }
		}
	    });
	}
    }
};


var Container={
    props:{
	css:{
	    containerClass:"notes-view",
	    itemClass:"notes-item",
	    itemIndividualClass:"notes-view-item-id-",
	    removeNotesClass:"notes-remove",
	    noteTextClass:"notes-text"
	}
    },
    htmlContainerDomItem:function(noteId,noteText){
	let noteContainer="<div class='row "+
	    this.props.css.itemClass+" "+
	    this.props.css.itemIndividualClass+
	    noteId+
	    "'>";
	let removeLink="<a onclick='Container.deleteItem("+
	    noteId+
	    ")' href='#' class='glyphicon glyphicon-remove "+
	    this.props.css.removeNotesClass+
	    "' ></a>";

	//TODO:Add editable property
	// "' onclick='editTextContent()'>"+
	let noteTextContainer="<div class='"+
	    this.props.css.noteTextClass+"'>"+
	    noteText+"</div>";
	
	let closingTags="</div>";
	
	return noteContainer+removeLink+noteTextContainer+closingTags;
    },

    
    //This is costly in terms of dom rendering .Find out a way or optimise using a stack
    showContainer:function(){
	var container=$("."+this.props.css.containerClass);
	$(container).html("");
	
	Notes.sort(Notes.sortItems);
	$.each(Notes,(index,note)=>{
	    $(container).append(Container.htmlContainerDomItem(note.id,note.text));
	});
    },

    deleteContainerContents:function(){
	$("."+this.props.css.containerClass).html("");
	Utility.unColorRanges(Notes.getAllId());
	Notes=[];
    },
    
    deleteItem:function(id){
	Utility.unColorRanges(id);
	Notes.removeItem(id);
	$("."+this.props.css.itemIndividualClass+id).remove();
    }
};



var loadScripts={
    loadJQuery:function(){
	if(!window.jQuery)
	{
	    var JQscript = document.createElement('script');
    	    JQscript.type = "text/javascript";
	    JQscript.src = JQUERY_URL;
	    JQscript.onload=function(){
		loadScripts.loadJQueryUI();
	    }
	    document.getElementsByTagName('head')[0].appendChild(JQscript);
	}
	else{
	    this.loadJQueryUI()
	}
    },
    loadJQueryUI:function(){
	if(!jQuery.ui){
	    var JQUIscript = document.createElement('script');
	    JQUIscript.type = "text/javascript";
	    JQUIscript.src = JQUERYUI_JS_URL;

	    var JQUICSS=document.createElement("link");
	    JQUICSS.rel="stylesheet";
	    JQUICSS.type="text/css";
	    JQUICSS.href=JQUERYUI_CSS_URL;

	    JQUIscript.onload=this.runCatchMyNotes();

	    document.getElementsByTagName('head')[0].appendChild(JQUIscript);
	    document.getElementsByTagName('head')[0].appendChild(JQUICSS);
	}
    },
    runCatchMyNotes:function(){
	MenuBar.showMenu();
	addEvents();
    }
};

(function(){
    loadScripts.loadJQuery();
})();
