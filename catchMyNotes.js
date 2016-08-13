/*
  Author:krishna vikas
  License:MIT
  email:krishna.vikasreddy@gmail.com
*/

/*
  This is now designed as a bookmarklet as of now,later on we can convert it into a chrome extension and others.
*/

//asking the page to load our object as it is clicked on
(function(obj){
    // this is where the script begins
    // like the constructor
    if(!window.jQuery)
    {
	var script = document.createElement('script');
	script.type = "text/javascript";
	script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js";	document.getElementsByTagName('head')[0].appendChild(script);
    }
    addEvents();
    
})();

//Notes is the Object we store all our selected data
//As we go on we might increase the requirements of the Notes object
var Notes={
    
}


function addEvents(){
    var body=document.getElementsByTagName("body")[0];
    body.onmouseup=function(){
	var sel=window.getSelection();

	//TODO: change the green-text and add a generic class
	var spanElemStart =document.createElement("span");
	spanElemStart.setAttribute("class","green-text");

	var spanElemEnd =document.createElement("span");
	spanElemEnd.setAttribute("class","green-text");

	// check if the current selection is in the same node
	if(sel.anchorNode === sel.focusNode)
	{
	    var range=sel.getRangeAt(0);
	    range.surroundContents(spanElemStart);
	}

	//if not split it and add the styles accordingly
	else
	{
	    // anchorNode
	    var rangeA=document.createRange();
	    rangeA.setStart(sel.anchorNode,sel.anchorOffset);
	    rangeA.setEnd(sel.anchorNode,sel.anchorNode.length);
	    rangeA.surroundContents(spanElemStart);

	    //focusNode
	    var rangeF=document.createRange();
	    rangeF.setStart(sel.focusNode,0);
	    rangeF.setEnd(sel.focusNode,sel.focusOffset);
	    rangeF.surroundContents(spanElemEnd);
	}

	window.getSelection().empty();
	
    }    
}


