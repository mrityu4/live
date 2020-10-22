let grid = document.getElementById("contacts");
grid.style.fontSize='x-large';
let s="callicon";
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

function addcontact(id){
    let diff='contact';
    let curcontact = grid.insertRow(0);
    curcontact.id = id+diff;
    curcontact.innerHTML=userNameOf[id];
    curcontact.style.color='white';
    let callicon=curcontact.insertCell(0);
    callicon.id=id+s;
    callicon.innerHTML='<img src="./35459.svg" width="25px"/>';
    callicon.value="call";
    callicon.addEventListener("click", handlecall);
    // 35459.svg-call
    // 35364.svg-ring
    //35225.svg-cut

    
    // console.log(userNameOf[id],userNameOf,id);
}
let myaudiostream;
function handlecall(e){
    let calliconid=e.target.id;
    let callerid = e.target.id;
    callerid=callerid-s;
    if(e.target.value=="call"){
        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        navigator.getUserMedia (
            {video: false, audio: true},
            function success(localAudioStream) {
                myaudiostream= localAudioStream;
            },
            function error(err) {
                    console.log("no audio permission",err);
                }
            );
            let outgoingcall = peer.call(callerid, myaudiostream);
            console.log("calling");


    }    
}
peer.on('call', function(incoming) {
    console.log("call received");
    incoming.on('stream', function(stream) {
        var audio = $('<audio autoplay />').appendTo('body');
        audio[0].src = (URL || webkitURL || mozURL).createObjectURL(stream);      
    });
  });
  
