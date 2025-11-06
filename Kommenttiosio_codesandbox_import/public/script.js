/* Client chat logic for Kommenttiosio */

const socket = io();
const messages = document.getElementById('messages');
const inputRow = document.getElementById('inputRow');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

const nickModal = document.getElementById('nickModal');
const nickInput = document.getElementById('nickInput');
const joinBtn = document.getElementById('joinBtn');

const msgSound = document.getElementById('msgSound');

const COLORS = [
  '#ff66cc','#00ffff','#ffff66','#ff9900','#66ff66','#ff3366','#66ccff','#ffcc66'
];

let myNick = null;
let myColor = null;

function randomColor(){ return COLORS[Math.floor(Math.random()*COLORS.length)]; }

joinBtn.addEventListener('click', ()=>{
  const nick = nickInput.value.trim();
  if(!nick) return;
  myNick = nick.slice(0,20);
  myColor = randomColor();
  socket.emit('setUsername', { nick: myNick, color: myColor });
  nickModal.style.display = 'none';
  inputRow.hidden = false;
});

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendMessage(); });

function sendMessage(){
  const txt = messageInput.value.trim();
  if(!txt) return;
  socket.emit('chatMessage', txt);
  messageInput.value = '';
}

// receive messages
socket.on('chatMessage', (data)=>{
  const line = document.createElement('div');
  line.className = 'msg-line';

  const nickEl = document.createElement('span');
  nickEl.className = 'msg-nick';
  nickEl.textContent = data.nick + ':';
  nickEl.style.color = data.color || '#fff';

  const textEl = document.createElement('span');
  textEl.className = 'msg-text';
  textEl.textContent = ' ' + data.text;

  line.appendChild(nickEl);
  line.appendChild(textEl);
  messages.appendChild(line);
  messages.scrollTop = messages.scrollHeight;

  // play sound but don't block if autoplay blocked
  if(msgSound){ msgSound.currentTime = 0; msgSound.play().catch(()=>{}); }
});