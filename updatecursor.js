
var indicator;
function updatecursor(peerid,userName, curPostn) {
    var cursorElement = document.getElementById(peerid);
    if (cursorElement == null) {
         indicator=document.createElement('span');
        indicator.innerHTML=userName;
        indicator.style.color="black";
        indicator.style.opacity=1.0;
        indicator.style.position="absolute";
        indicator.style.top="-12px";
        indicator.style.zIndex=9999;
    
        cursorElement = document.createElement('div');
        cursorElement.setAttribute("id", peerid);
        cursorElement.classList.add("CodeMirror-cursor");  
        document.querySelector("body >div:nth-child(3)> div > div.CodeMirror-scroll > div.CodeMirror-sizer > div > div > div").appendChild(cursorElement);
        cursorElement.appendChild(indicator);
        cursorElement.style.padding = 0;
        indicator.style.backgroundColor='#ffffff';
    

    }
    cursorElement.style.left = curPostn["ch"]*editor.defaultCharWidth();

    console.log(curPostn,"c");
    cursorCoords=editor.cursorCoords(curPostn);
    cursorElement.style.height=editor.defaultTextHeight()+10;
    cursorElement.style.top = curPostn["line"]*editor.defaultTextHeight()-10;
  

}





//updating  cursor address
editor.on("cursorActivity", function () {
    var newpos = editor.getCursor();
    document.getElementById("lineno").innerHTML = newpos["line"];
    document.getElementById("charno").innerHTML = newpos["ch"];
    broadcastMessage({ "line": newpos["line"], "ch": newpos["ch"], "sticky": newpos["sticky"] });

});
