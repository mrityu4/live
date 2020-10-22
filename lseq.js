let boundary=10;
function ps(s,k){console.log(s,k);}
function p(s){console.log(s);}
let unitStructure=[[]];
lineArray=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99];
let count=0;
editor.on("beforeChange",function(a,b){
    ++CountQueuingStrategy;
    let d=new unit(b);
    //   p(d);
});

class unit {
    mainaddress=[];
    val='';
    peerid=peer.id;
    operationNo=0;
  constructor(change) { 
     this.operationNo=(++count);

      let line;
      p(change);

     if(change.origin=="+input"){
         if(change.text.length==2){//line break
            //  unitStructure.splice(change.from.line+1,0,[]);
//              p(change,"fd");
             if(unitStructure[change.from.line]===undefined || unitStructure[change.from.line].length==change.from.ch)//no char after line break
            {
                console.log("line break at the end");
                this.val='\n';
                 this.mainaddress=calculateAddress(change);
                console.log(this.mainaddress);
                
                //broadcasting operation
                var m={op:'i',structure:this};
                
                broadcastMessage(JSON.parse(JSON.stringify(m)));



                let insertpos=findAddressLine(this.mainaddress);
                if(insertpos.ch!=0){
                    if(unitStructure[insertpos.line][insertpos.ch-1].val=='\n')
                   { ++(insertpos.line);
                    insertpos.ch=0;}
                }
                 if(unitStructure[insertpos.line]=== undefined)unitStructure[insertpos.line]=[];
                 unitStructure[insertpos.line].splice(insertpos.ch,0,this);
//                 if(change.from.ch>0){//inserting new line below currnt line
//                 unitStructure.splice(change.from.line+1,0,[]);   }
//                 else
//                 if(change.from.ch==0)
//                 {//inserting a new line above current line
//                     unitStructure.splice(change.from.line,0,[]);
//                 }
               
                // unitStructure[0]=[];
//                 if(unitStructure[insertpos.line]=== undefined)unitStructure[insertpos.line]=[];
               
             }
             else if(unitStructure[change.from.line].length>change.from.ch){//characters aftere line break
                  console.log("chars after line break");
                this.val='\n';
                 this.mainaddress=calculateAddress(change);
                console.log(this.mainaddress);
                var m={op:'i',structure:this};
                
                broadcastMessage(JSON.parse(JSON.stringify(m)));
                 let insertpos=findAddressLine(this.mainaddress);
                let charsafterlinebreak=unitStructure[change.from.line].splice(insertpos.ch,(unitStructure[insertpos.line].length-insertpos.ch),this);
                 unitStructure.splice(insertpos.line+1,0,charsafterlinebreak);
//                 if(change.from.ch>0){//inserting new line below currnt line
//                     unitStructure.splice(change.from.line+1,0,[]); 

//                   }
//                 else
//                 {//inserting a new line above current line
//                     unitStructure.splice(change.from.line,0,[]);
//                 }

             }
             else{//error
                 console.log("err while inserting line break",change);
             }
         }
         else{
             if(change.text.length==1 && change.text[0].length==1){//handle single letter insert
                
                this.val=change.text[0][0];
                this.mainaddress=calculateAddress(change);
                console.log(this.mainaddress);
                let insertpos=findAddressLine(this.mainaddress);
                // unitStructure[0]=[];
                var m={op:'i',structure:this};
                
                broadcastMessage(JSON.parse(JSON.stringify(m)));
                if(insertpos.ch!=0){
                    if(unitStructure[insertpos.line][insertpos.ch-1].val=='\n')
                   { ++(insertpos.line);
                    insertpos.ch=0;}
                }
                if(unitStructure[insertpos.line]=== undefined)unitStructure[insertpos.line]=[];
                unitStructure[insertpos.line].splice(insertpos.ch,0,this);
             }        
        }
   }
   else if(change.origin="+delete"){
    
       if(change.to.line==change.from.line && change.to.ch-change.from.ch==1){//single char delete
        var m={op:'d',structure:unitStructure[change.from.line][change.from.ch]};             
        broadcastMessage(JSON.parse(JSON.stringify(m)));
        unitStructure[change.to.line].splice(change.from.ch,1);
    }
       else if(change.to.line-change.from.line==1 && change.to.ch==0){//line break delete
        var m={op:'d',structure:unitStructure[change.from.line][unitStructure[change.from.line].length-1]};             
        broadcastMessage(JSON.parse(JSON.stringify(m)));
        unitStructure[change.from.line].splice(unitStructure[change.from.line].length-1,1,...unitStructure[change.to.line]);
        unitStructure.splice(change.to.line,1);
       }

   }
}}
function foreignInsert(structure){
    console.log(structure,"foreign insert");
    let insertpos=findAddressLine(structure.mainaddress);
    if(structure.val=='\n'){//line break

         if(unitStructure[insertpos.line]===undefined || unitStructure[insertpos.line].length==insertpos.ch)//no char after line break
        {
            console.log("line break at the end",structure.mainaddress);
            if(insertpos.ch!=0){
                if(unitStructure[insertpos.line][insertpos.ch-1].val=='\n')
               { ++(insertpos.line);
                insertpos.ch=0;}
            }
             if(unitStructure[insertpos.line]=== undefined)unitStructure[insertpos.line]=[];
             editor.replaceRange(structure.val,insertpos,insertpos);
             unitStructure[insertpos.line].splice(insertpos.ch,0,structure);
           
         }
         else if(unitStructure[insertpos.line].length>insertpos.ch){//characters aftere line break
              console.log("chars after line break",structure.mainaddress);
              editor.replaceRange(structure.val,insertpos,insertpos);
            let charsafterlinebreak=unitStructure[insertpos.line].splice(insertpos.ch,(unitStructure[insertpos.line].length-insertpos.ch),structure);
             unitStructure.splice(insertpos.line+1,0,charsafterlinebreak);
         }
         else{//error
             console.log("err while inserting line break",change);
         }
     }
     else{
             //handle single letter insert  
            console.log(structure.mainaddress);
            if(insertpos.ch!=0){
                if(unitStructure[insertpos.line][insertpos.ch-1].val=='\n')
               { ++(insertpos.line);
                insertpos.ch=0;}
            }
            if(unitStructure[insertpos.line]=== undefined)unitStructure[insertpos.line]=[];
            editor.replaceRange(structure.val,insertpos,insertpos);
            unitStructure[insertpos.line].splice(insertpos.ch,0,structure);         
    }
}

  function calculateAddress(change){
      let addAfter=findAddAfter(change.from);
      let addBefore=findAddBefore(change.from);
      let address=calculateAddBetween(addBefore,addAfter);
      return address;

  }
  function findAddBefore(pos){
    //   console.log(pos);

      if(pos.line==0 && pos.ch==0){
        // console.log("here00");
            let s=[];
            // console.log(s.length);
          return s;
        }
      if(pos.ch==0)return unitStructure[pos.line-1][unitStructure[pos.line-1].length-1].mainaddress;
      return unitStructure[pos.line][(pos.ch)-1].mainaddress;
  }
  function findAddAfter(pos){
      let noOfChars=(unitStructure[unitStructure.length-1] && unitStructure[unitStructure.length-1].length) || 0;
      if(pos.line==(unitStructure.length-1) && pos.ch==(noOfChars))return [];//last char of line
      if(pos.line==unitStructure.length)return [];//first char on new line
    //   p("here2");
    //last char not at last line-this cannot happen because there wiil be a line break at the end(if there is a line after)
//       if(pos.line<(unitStructure.length-1)  && pos.ch==(unitStructure[pos.line].length-1))return unitStructure[pos.line+1][0].mainaddress; //   p("here3");
      return unitStructure[pos.line][pos.ch].mainaddress;
      
  }
  function calculateAddBetween(addBefore,addAfter){
      let usemyid=false;
      ps(addBefore,addAfter);
      let boundaryplus=false;//hey
      let address=[],base;
      let addBeforeLen=(addBefore && addBefore.length) ||0;
        if(addBeforeLen==0){addBefore=[{index:0,id:peer.id}];addBeforeLen=1;}
      let addAfterLen=(addAfter && addAfter.length) || 0;
      if(addAfterLen==0){addAfter=[{index:32,id:peer.id}];addAfterLen=1;} 
      let level;
      for(level=0;;++level){
        base=Math.pow(2,level+5);
          let levelOfAfter=(addAfter[level] ||{index:base,id:peer.id});
          let levelOfBefore=(addBefore[level] || {index:0,id:peer.id});
          let availableSpace=levelOfAfter.index-levelOfBefore.index;
            if(usemyid)levelOfAfter.id=peer.id;
        //   console.log(addAfter[level].index,addAfter[level]);
          boundaryplus=!boundaryplus;
         
            if(availableSpace>1){//indexing possible at this level
                address.push({index:calculateIndex(levelOfBefore.index,levelOfAfter.index,boundaryplus),id:peer.id});
                return address;
            }
            else if(availableSpace==1)//new level required
            {   usemyid=true;
                address.push(levelOfBefore);
                // if(addBefore.length>(level+1))
                // {
                //     address.push({index:calculateIndex(addBefore[level+1].index,base*2,!boundaryplus),id:peer.id});
                //     return address;
                // }
            //    else
            //         address.push({index:calculateIndex(0,base*2,!boundaryplus),id:peer.id});
            //         return address;
               
                    // between index at next level at addBefore(or 0 is no next level in addBefore) and base 
            }
            else if(availableSpace==0){//indexes are equal
                address.push(levelOfBefore);
                if(levelOfBefore.id<levelOfAfter.id)usemyid=true;
                //  if(levelOfBefore.id==levelOfAfter.id){ //copy this level and move to next level
                //     address.push(levelOfBefore);//eventually there will be a difference
                //  }
                //  else if(levelOfBefore.id<levelOfAfter.id){   
                //      //same index but from different users,this can happen at the end of above case
                //         address.push(levelOfBefore);//this will make it equal to addBefore and less than addAfter 
                    //     if(addBefore.length>(level+1))
                    //     {
                    //         address.push({index:calculateIndex(addBefore[level].index,base,boundaryplus),id:peer.id});
                    //         return address;
                    //     }
                    //    else
                    //         {
                    //             address.push({index:calculateIndex(0,base,boundaryplus),id:peer.id});     
                    //             return address;       //assign new index at next level with inserters id,now address is greater than addBefore
                    //         }
                        // between index at next level at addBefore(or 0 is no next level in addBefore) and base 
//                  }
//                  else{
//                      console.log("units are not sorted correctly")
//                  }
            }
      }
  }
  function calculateIndex(indexBefore,indexAfter,boundaryplus){            //Math.random()->   0  to 0.9999999999
    let start;
   
    if ((indexAfter-indexBefore) < boundary) {//no space to decide between strategies
        return indexBefore+1+Math.floor(Math.random()*(indexAfter-indexBefore-1));
        //we need indexBefore+1 to less than indexAfter    
      } 
      else//we have space for boundary +/-
       {
        //    range=boundary;
             if (boundaryplus) { //boundary +
                start = indexBefore +1;
                // range=boundary;
                } else {
                    start=indexAfter-boundary;
                    // range=boundary;
                }
      }
      return start + Math.floor(Math.random() * boundary);
}
//for deletion
function findIndex(address){
    let lastLine=unitStructure.length-1;
    if(lastLine==0 && unitStructure[0].length==0)//empty structure
      return;
    //after last char
    if(unitStructure[lastLine].length>0 && greater(address.mainaddress,unitStructure[lastLine][unitStructure[lastLine].length-1].mainaddress)==0)
        {
            deleteUnit(lastLine,unitStructure[lastLine].length-1);
            return;
        }   
    if(lastLine==0){
     return findInLine(address.mainaddress,lastLine);  
    }
    let start=0,end=lastLine;
    let result,inEndline,mid;
    //finding line
    while(end>start){
        mid=Math.floor((start+end)/2);
        result=greater(address.mainaddress,unitStructure[mid][0].mainaddress);
        if(result==1){//greater
                start=mid;
        }
        else if(result==-1){//smaller
            end=mid-1;
        }
        else{
            deleteUnit(mid,0);
            return;
        }
    }
    //finding index in line
    findInLine(address.mainaddress,mid); 
}
function findInLine(address,line){
    let start,end,mid,result;
    start=2;
    end=unitStructure[line].length-1;
    while(start<end){
        mid=Math.floor((start+end)/2);
        result=greater(address,unitStructure[mid][0].mainaddress);
        if(result==1){//greater
                start=mid+1;
        }
        else if(result==-1){//smaller
            end=mid-1;
        }
        else{
            deleteUnit(line,mid);
            return;
        }
    }
    console.log("not present");
}
function deleteUnit(line,ch){
    if(unitStructure[line][ch].val!='\n'){//single char delete
    editor.replaceRange('',{line:line,ch:ch},{line:line,ch:ch+1});
    unitStructure[line].splice(ch,1);
    }
   else
   {//line break delete
    editor.replaceRange('',{line:line,ch:ch},{line:line+1,ch:0});
    unitStructure[line].splice(unitStructure[line].length-1,1,...unitStructure[line+1]);
    unitStructure.splice(line+1,1);
   }

}
//for insertion
function findAddressLine(address){
    let lastLine=unitStructure.length-1;
    if(lastLine==0 && unitStructure[0].length==0)//empty structure
        return { line:0,ch:0};
    if(greater(unitStructure[0][0].mainaddress,address)==1)//before first char
       {
           return{line:0,ch:0};
//            return { line:lastLine-1,ch:0};
       }
     
//     if(greater(uni))
    //after last char
    if(unitStructure[lastLine].length>0 && greater(address,unitStructure[lastLine][unitStructure[lastLine].length-1].mainaddress)==1)
        return {line:lastLine,ch:unitStructure[lastLine].length}
//     if(las)
    if(lastLine==0){
     return indexInLine(address,lastLine);  
    }
    let start=0,end=lastLine;
    let result,inEndline,mid;
    //finding line
    while(end-start>1){
        mid=Math.floor((start+end)/2);
        result=greater(address,unitStructure[mid][0].mainaddress);
        if(result==1){//greater
                start=mid;
        }
        else if(result==-1){//smaller
            end=mid-1;
        }
        else{
            console.log("error in findAdrresssLine function ");
        }
    }
    //finding index in line
    if(start==end)inEndline=1;
    else inEndline=greater(address,unitStructure[end][0].mainaddress);
    if(inEndline==1){//greater--find in endline and before the first char of next line
        if(greater(unitStructure[end][unitStructure[end].length-1].mainaddress,address)==-1)
            {
                return {line:end+1,ch:0};//check if last char is \n
            }
        return indexInLine(address,end)
    }
    else if(inEndline==-1)//less--find in startline/end-1 and before the first char of end line
    {
        if(greater(unitStructure[end-1][unitStructure[end-1].length-1].mainaddress,address)==-1)
            {
                return {line:end,ch:0};
            }
        return indexInLine(address,end-1);
    }
   
}

//fin pos in line for insertion
function indexInLine(address,endLine){
    let start=0,end=unitStructure[endLine].length-1;
    let mid;
    while(end-start>1){
        mid=Math.floor((end-start)/2)+start;
        result=greater(address,unitStructure[endLine][mid].mainaddress);
        if(result==1){
            start=mid;
        }
        else if(result==-1){
            end=mid;
        }
        else {
            console.log("error in index in Line function");
        }    
    }
    return {line:endLine,ch:start+1};
}
function greater(addressA,addressB){
    let result;
    let addBLen=(addressB && addressB.length) || 0;
    let addALen=(addressA && addressA.length) || 0;

    for(var level =0;level<Math.min(addALen,addBLen);++level){
        result=greateratlevel(addressA[level],addressB[level]);
        if(result==1)return 1;
        else if(result==-1)return -1;
    }
    if(addALen>addBLen)return 1;
    if(addALen<addBLen)return -1;
    return 0;
}
function greateratlevel(a,b){
    if(a.index >b.index)return 1;
    else if(a.index<b.index)return -1;
    else if(a.id>b.id)return 1;
    else if(a.id<b.id)return -1;
    return 0;
}
//for deletion
function findAddressLineRange(address){
    let lastLine=unitStructure.length-1;
    let start=0;
     let end=lastline;
    let result,mid;
    let instartline=false;
    if(greater(unitStructure[lastLine][unitStructure[lastLine].length-1].mainaddress,address)==0)// last char
    // if(lastLine==0 && unitStructure[0].length==0)//empty structure
    // if(greater(unitStructure[0][0].mainaddress,address)==1)//before first char
    
    
   
    //finding line
    while(end-start>1){
        mid=Math.floor((start+end)/2);
        result=unitStructure[mid][0].compare(address);
        if(result){//greater
                start=mid;
                instartline=true;
        }
        else if(result){//smaller
            end=mid-1;
            instartline
        }
        else{//found
            return {line:mid,char:0};
        }
    }
    //finding index in line
    endlinepresence=unitStructure[end][0].compare(address);
    if(endlinepresence){//greater--find in endline

    }
    else if(endlinepresence)//less--find in startline/end-1
    {

    }
    else{//start of endline

    }
}

// }
// doc.getLineHandle(num: integer) → LineHandle
// Fetches the line handle for the given line number.
// doc.getLineNumber(handle: LineHandle) → integer
// Given a line handle, returns the current position of that line (or null when it is no longer in the document).


// doc.eachLine(f: (line: LineHandle))

// doc.eachLine(start: integer, end: integer, f: (line: LineHandle))
// Iterate over the whole document, or if start and end line numbers are given, the range from start up to 
// (not including) end, and call f for each line, passing the line handle. This is a faster way to visit a range 
// of line handlers than calling getLineHandle for each of them. Note that line handles have a text property containing
//  the line's content (as a string).

// doc.lineInfo(line: integer|LineHandle) → object
// Returns the line number, text content, and marker status of the given line, which can be either a number or a line handle. 
// The returned object has the structure {line, handle, text, gutterMarkers, textClass, bgClass, wrapClass, widgets}, 
// where gutterMarkers is an object mapping gutter IDs to marker elements, and widgets is an array of line widgets attached 
// to this line, and the various class properties refer to classes added with addLineClass.

// cm.getTokenAt(pos: {line, ch}, ?precise: boolean) → object
// Retrieves information about the token the current mode found before the given position (a {line, ch} object). 
// The returned object has the following properties:
// start
// The character (on the given line) at which the token starts.
// end
// The character at which the token ends.
// string
// The token's string.
// type
// The token type the mode assigned to the token, such as "keyword" or "comment" (may also be null).
// state
// The mode's state at the end of this token.
// If precise is true, the token will be guaranteed to be accurate based on recent edits. If false or not specified, 
// the token will use cached state information, which will be faster but might not be accurate if edits were recently 
// made and highlighting has not yet completed.


// cm.getLineTokens(line: integer, ?precise: boolean) → array<{start, end, string, type, state}>
// This is similar to getTokenAt, but collects all tokens for a given line into an array. It is much cheaper than 
// repeatedly calling getTokenAt, which re-parses the part of the line before the token for every call.


// cm.getTokenTypeAt(pos: {line, ch}) → string
// This is a (much) cheaper version of getTokenAt useful for when you just need the type of the token at a given 
// position, and no other information. Will return null for unstyled tokens, and a string, potentially containing 
// multiple space-separated style names, otherwise.


// cm.operation(func: () → any) → any
// CodeMirror internally buffers changes and only updates its DOM structure after it has finished performing some 
// operation. If you need to perform a lot of operations on a CodeMirror instance, you can call this method with a 
// function argument. It will call the function, buffering up all changes, and only doing the expensive update after 
// the function returns. This can be a lot faster. The return value from this method will be the return value of your 
// function.


// cm.startOperation()
// cm.endOperation()
// In normal circumstances, use the above operation method. But if you want to buffer operations happening asynchronously, 
// or that can't all be wrapped in a callback function, you can call startOperation to tell CodeMirror to start buffering 
// changes, and endOperation to actually render all the updates. Be careful: if you use this API and forget to call 
// endOperation, the editor will just never update.


// doc.lineCount() → integer
// Get the number of lines in the editor.

// doc.posFromIndex(index: integer) → {line, ch}
// Calculates and returns a {line, ch} object for a zero-based index who's value is relative to the start of the editor's text. 
// If the index is out of range of the text then the returned object is clipped to start or end of the text respectively.
// doc.indexFromPos(object: {line, ch}) → integer
// The reverse of posFromIndex.


// CodeMirror.Pos(line: integer, ?ch: integer, ?sticky: string)
// A constructor for the objects that are used to represent positions in editor documents. sticky defaults to null, 
// but can be set to "before" or "after" to make the position explicitly associate with the character before or after it.
// editor instance fires the following events. The instance argument 
// always refers to the editor itself.
// "change" (instance: CodeMirror, changeObj: object)
// Fires every time the content of the editor is changed. The changeObj is a 
// {from, to, text, removed, origin} object containing information about the
//  changes that occurred as second argument. from and to are the positions 
//  (in the pre-change coordinate system) where the change started and ended 
//  (for example, it might be {ch:0, line:18} if the position is at the beginning
//      of line #19). text is an array of strings representing the text that 
//      replaced the changed range (split by line). removed is the text that 
//      used to be between from and to, which is overwritten by this change.
//       This event is fired before the end of an operation, before the DOM updates happen


 
// Document objects (instances of CodeMirror.Doc) emit the following events:
// "change" (doc: CodeMirror.Doc, changeObj: object)
// Fired whenever a change occurs to the document. changeObj has a similar type as
//  the object passed to the editor's "change" event.


// Line handles (as returned by, for example, getLineHandle) support these events:
// "delete" ()
// Will be fired when the line object is deleted. A line object is associated with 
// the start of the line. Mostly useful when you need to find out when your gutter 
// markers on a given line are removed.
// "change" (line: LineHandle, changeObj: object)
// Fires when the line's text content is changed in any way (but the line is not 
//     deleted outright). The change object is similar to the one passed to change 
//     event on the editor object.
