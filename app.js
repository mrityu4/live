var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    theme: "dracula",
    lineNumbers: true,
    lineWrapping:true

});
let userNameOf=new Map();
connections = [];
var connection = null;
editor.setSize("1000", "85%");
var idtablereceived = false;
var marker;

let  myUserName = prompt("Please enter your name");

peer = new Peer(null, {
    secure: true, 
    host: 'peersrver.herokuapp.com', 
    port: 443,
    config: {
        // iceServers:[
        //   {urls: ["turn:173.194.72.127:19305?transport=udp",
        //      "turn:[2404:6800:4008:C01::7F]:19305?transport=udp",
        //      "turn:173.194.72.127:443?transport=tcp",
        //      "turn:[2404:6800:4008:C01::7F]:443?transport=tcp"
        //      ],
        //    username:"CKjCuLwFEgahxNRjuTAYzc/s6OMT",
        //    credential:"u1SQDR/SQsPQIxXNWQT7czc/G4c="
        //   },
        //   {urls:["stun:stun.l.google.com:19302"]}
        // ]
        iceServers:[
            { url: 'turn:52.91.216.110:3478',
            credential: 'pADPEER',
            username: 'mritunjay'
        }]
    },
    debug: 3
});

//initial setup
peer.on('open', function (id) {

    if (peer.id === null) {
        console.log('Received null id from peer open');
        peer.id = lastPeerId;
    } else {
        lastPeerId = peer.id;
    }
    document.getElementById("link").classList.remove("loader");// remove loading sign

    var str = window.location.href;
    var n = str.lastIndexOf('?id=');
    document.getElementById("link").value = "https://mrityu4.github.io/live/" + "?id=" + peer.id;

    if (n == -1) {//root user
        idtablereceived = true;

    }
    else {
        var recvdid = str.substring(n + 4);

        //connecting----Connects to the remote peer specified by id and returns a data connection
        connection = peer.connect(recvdid, {
            reliable: true,
        });
        askingforidTable(connection);
        connections.push(connection);
        // ready(connection);

    }
    document.getElementById("link").innerHTML = "Joining Link";

});
//called when you are receiving a connection reqest
peer.on("connection", function (conn) {//
    connection = conn;
    connections.push(connection);
    console.log(peer.connections);

    handleidTablerequest(conn);
    console.log("Connected to: " + conn.peer);
});


function askingforidTable(aconnection) {
    // console.log("");
    aconnection.on("open", function () {
        // console.log("in asker", aconnection);
        aconnection.send(["send",myUserName]);
        aconnection.on('data', function (data) {//peerid and username
        console.log("in askerreceiving");
                console.log(data, "asker");
                if(Array.isArray(data)){
                    if (data[0] == "sent"){ 
                        userNameOf[aconnection.peer]=data[1];
                        idtablereceived = true;
                        aconnection.off("data");
                        receivedata(aconnection);
                        return;
    
                    }
                    else if(Object.keys(peer.connections).includes(data[0]))
                        userNameOf[data[0]]=data[1];
                    else{ 
                       let conn = peer.connect(data[0], {//
                            reliable: true,
                            });
                        userNameOf[data[0]]=data[1];
                        // askingforidTable(conn);
                        conn.on("open",function(){
                            conn.send(["dont send",myUserName]);
                            receivedata(conn);
                        });
                        connections.push(conn);
                    }
                }
         });
        });
    }
               



function handleidTablerequest(hconnection) {
    hconnection.on("open", function () {
        let idTableSent=false;
        hconnection.on('data', function (data) {
                console.log("handler",data);
                if (Array.isArray(data) && data[0] == "dont send") {
                    idTableSent = true;
                    userNameOf[hconnection.peer]=data[1];
                    hconnection.off('data');  
                    receivedata(hconnection);
                    return;
                    }
                else if (Array.isArray(data) && data[0] == "send") {
                    userNameOf[hconnection.peer]=data[1];
                    for (var p in peer.connections) {
                            hconnection.send([p,userNameOf[p]]);    
                    }
                    console.log("sent");
                    hconnection.send(["sent",myUserName]);
                    idTableSent = true;
                    hconnection.off('data');  
                    receivedata(hconnection);
                    return;
                }
        });
    });
}



function receivedata(conn){
    addContact(conn.peer);

        conn.on("data",function (data) {
            console.log(conn.id,"receiving",data);
            if (Object.keys(data).length == 3) updatecursor(conn.peer,userNameOf[conn.peer], data);
            // else handlechar(hconnection.peer, data);
            else{
                if(data.op=='i'){
                    console.log('insert char recvd');
                foreignInsert(data.structure);
            }
                else if(data.op=='d'){
                    console.log('delete structure recvd');
                    findIndex(data.structure);
                }
            }
        });
}


//copy to clipboard
function updateClipboard() {
    var id = document.getElementById("link").value;
    navigator.clipboard.writeText(id).then(function () {
        console.log("copied");
    }, function () {
        console.log("err");
    });
}

//broadcast message
function broadcastMessage(message) {
  //  console.log(message);
    for (var i = 0; i < connections.length; i++) {
        connections[i].send(message);
    }
}


// var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
// 		var element = document.getElementById('text');
// 		if (isMobile) {
//   			element.innerHTML = "You are using Mobile";
// 		} else {
// 			element.innerHTML = "You are using Desktop";
// 		}   already present in codemirror (line 36)
