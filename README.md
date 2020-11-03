# peerPad

PeerPad is a peer-to-peer, live collaborative text editor made using javascript.


![alt text](https://github.com/mrityu4/live/blob/main/ezgif-3-f50e9fe97ea1.gif?raw=true)
Other collaborater's view
![alt text](https://github.com/mrityu4/live/blob/main/view.png?raw=true)


Peerpad uses CRDT (Conflict-free Replicated Data Types) to store index of each character in document. CRDT is just a concept, I use LSEQ(https://hal.archives-ouvertes.fr/hal-00921633/document) implementation from the linked research paper. This is enables all the peers to be in sync.

For connecton among users, I use peer.js( an abstration over WebRTC protocol ). WebRTC enables users to communicate with each other directly without relying on any server(hence decentralized and private ). Peer-to-peer architecture and UDP help to reduce latency to minimum. Data over WebRTC is end-to-end encrypted, there is no option to disable it.

## How to use
1. Go to https://mrityu4.github.io/live/
2. Enter your Name in Prompt(This is what others will see above your cursor)
You will see a spinning loader. Peerjs server is alloting you a unique peerID. Wait for few seconds(~5s) and you will see a **Joining Link** icon in the place of loader. Click on it, joining link of the current document is copied in your clipboard. Send it to your peers(e-mail, WhatsappWeb).

![alt text](https://github.com/mrityu4/live/blob/main/1.png?raw=true)
![alt text](https://github.com/mrityu4/live/blob/main/2.png?raw=true)


3. Ask them to paste it in browser and enter a name of their choice. Now peerjs is allocating a new peerID to the new user and after that he is connected to the user who originally shared the joining link.

![alt text](https://github.com/mrityu4/live/blob/main/3.png?raw=true)

4. After few seconds connection is established and users can collaborate.

# Libraries used
* peer.js
* codemirror.js
