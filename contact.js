let grid = document.getElementById("contacts");
grid.style.fontSize = 'x-large';
let s = "callicon";
let contactcounter = 0;
let curcontact = grid.insertRow(contactcounter++);
curcontact.innerHTML = "&emsp; &emsp;PEERS   ";
curcontact.style.color = 'white';
curcontact = grid.insertRow(contactcounter++);
curcontact.innerHTML = myUserName + "(You)";
curcontact.style.color = 'white';
function addContact(id) {
    let diff = 'contact';
    console.log(id);
    curcontact = grid.insertRow(contactcounter++);
    curcontact.id = id + diff;
    curcontact.innerHTML = userNameOf[id];
    curcontact.style.color = 'white';
}
