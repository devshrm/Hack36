const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
var from = document.getElementById('mydiv').dataset.test
var to = document.getElementById('mydiv2').dataset.test
var fromName = document.getElementById('mydiv3').dataset.test
var toName = document.getElementById('mydiv4').dataset.test

const socket = io.connect('http://localhost:3000/',{ 
    query:{
        userid : String(from),
        name : String(fromName)
    }
});

socket.on('private message' ,({content , from, time}) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meat"><span class="font-weight-bold">${toName}</span> <span>${time}</span></p>
    <p class="text">${content}</p>`;
    div.style.marginRight = "80px";
    document.querySelector('.chat-messages').append(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('message' , ({message , time})=>{
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meat"><span class="font-weight-bold">Admin</span> <span>${time}</span></p>
    <p class="text">${message}</p>`;
    div.style.color = "red";
    document.querySelector('.chat-messages').append(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})





chatForm.addEventListener('submit' , (e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
  
    
    //////
    var now = moment();
    var NowMoment = moment(now).format('h:mm a');
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meat"><span class="font-weight-bold">You</span> <span>${NowMoment}</span></p>
    <p class="text">${msg}</p>`;
    div.style.marginLeft = "80px";
    document.querySelector('.chat-messages').append(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    //////


    socket.emit('private message' ,{
        content : msg,
        to : to
    });

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})