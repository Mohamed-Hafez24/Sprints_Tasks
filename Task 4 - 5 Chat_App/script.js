"use strict";

var app_id = "1260724"
var key = "6efbf5b719e8e1f20af7"
var secret = "2585e5600b8e858ca41e"

var groupName ;
var userName ;
var user_id;
var userLocalName;
var send_time;
var userInfo = {};
var pusher;



function getMD5(body){
  return CryptoJS.MD5(JSON.stringify(body));
};

function getAuthSignaturePost(md5,timeStamp){
  return CryptoJS.HmacSHA256(`POST\n/apps/1260724/events\nauth_key=${key}&auth_timestamp=${timeStamp}&auth_version=1.0&body_md5=${md5}`,`${secret}`);
};

function getAuthSignatureGet(timeStamp){
  return CryptoJS.HmacSHA256(`GET\n/apps/1260724/channels/${groupName}\nauth_key=${key}&auth_timestamp=${timeStamp}&auth_version=1.0`,`${secret}`);
};

const generateId = function(){
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

const checkUserId = function(userName){
  if (localStorage.hasOwnProperty("userId") && localStorage.hasOwnProperty("userLocalName")) {
    user_id = localStorage.getItem("userId");
    userLocalName = localStorage.getItem("userLocalName");

  }
  else {
    user_id = localStorage.setItem("userId",generateId()+"-"+generateId()); // here someid from your google analytics fetch
    userLocalName = localStorage.setItem("userLocalName",userName);
  }
};

const joinGroup = function () {
  validatInput();
  groupName = document.getElementById("input-group").value;
  userName = document.getElementById("input-name").value;
  if( groupName !== '' && userName !== ''){
    document.getElementById("chatGroupName").innerText = groupName;
    checkUserId(userName);
    console.log("groupName : " + groupName + "\n" + "userName : " + userName );
    openChatWindow();
    startPusher();
  }
};

const openChatWindow =  function (){
  document.getElementById("first-screen").style.display = "none"
  document.getElementById("second-screen").style.display = "block"
  console.log( " chatGroupName " + document.getElementById("chatGroupName").innerText );
  timeCounter(59,0);
};

function startPusher (){
  if(typeof groupName !== "undefined"){
    // Enable pusher logging - don't include this in production
  Pusher.logToConsole = true;
  
  pusher = new Pusher(`${key}`, {
    cluster: 'ap2'
  });
  
  var channel = pusher.subscribe(`${groupName}`);
  console.log("pusher.subscribe : Active");

  channel.bind("my-event",function(data) {
    //alert(JSON.stringify(data));
    console.log("user Id : " + data.user_id);
    let msgContainer = document.getElementById("msgBlock");
    let newParagraph1 = document.createElement("P");
    let newParagraph2 = document.createElement("P");

    if(localStorage.getItem("userId") == data.user_id){
      newParagraph1.className = "border  pt-2 ps-2 pb-3 pe-3 w-75 float-end";
      newParagraph1.innerHTML = `<span id="user-name">You </span>: <span id="user-message">${data.send_message}</span>`;
      newParagraph2.className = "w-75 mb-3 float-end";
    }else{
      newParagraph1.className = "border  pt-2 ps-2 pb-3 pe-3 w-75 float-start";
      newParagraph1.innerHTML = `<span id="user-name">${data.userLocalName} </span>: <span id="user-message">${data.send_message}</span>`
      newParagraph2.className = "w-75 mb-3 float-start";

    }
    newParagraph2.id = "message-time";
    newParagraph2.innerHTML = `${data.send_time}`;

    msgContainer.appendChild(newParagraph1);
    msgContainer.appendChild(newParagraph2);
  });
  }
}

const  getCurrentDate = function(){
  let today = new Date();
  let date = String(today.getDate()).padStart(2, '0')+'-'+ String(today.getMonth()+1).padStart(2, '0')+'-'+String(today.getFullYear()).padStart(2, '0');
  let time = String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0');
  let dateTime = date + "  " +time;
  return dateTime;
}

var sendMessage = async function(){
  let send_message = document.getElementById("message").value;
  if( send_message !== ''){
    userInfo = {
      userLocalName: localStorage.getItem("userLocalName"),
      user_id: localStorage.getItem("userId"),
      send_message: send_message,
      send_time: getCurrentDate()
    };
    console.log("id : " + user_id +  "\n" + " Local userId " + localStorage.getItem("userId"));
    
    let body = {data:`${JSON.stringify(userInfo)}`,name:"my-event",channel:`${groupName}`};
    let timeStamp = Date.now()/1000;
    let md5=getMD5(body);
    let url =`https://cors.bridged.cc/https://api-ap2.pusher.com/apps/1260724/events?body_md5=${md5}&auth_version=1.0&auth_key=${key}&auth_timestamp=${timeStamp}&auth_signature=${getAuthSignaturePost(md5,timeStamp)}`;
    let req = await fetch(url,{
        method:'POST',
        body:JSON.stringify(body),
        headers:{
            'Content-Type':'application/json'
        }
    });

    var textarea = document.querySelector('#message');
    textarea.value = "";
    stopTimer();
    timeCounter(59);
  }
}

var countUsers = async function(){  
  // GET /apps/[app_id]/channels/[channel_name]/users
  //let body = {data:`${JSON.stringify(userInfo)}`,name:"my-event",channel:`${groupName}`};
  let timeStamp = Date.now()/1000;
  let url =`https://cors.bridged.cc/https://api-ap2.pusher.com/apps/1260724/channels/${groupName}?auth_version=1.0&auth_key=${key}&auth_timestamp=${timeStamp}&auth_signature=${getAuthSignatureGet(timeStamp)}`;
  console.log("url : " + url);
  try {
  let res = await fetch(url,{
      method:'GET',
      headers:{
          'Content-Type':'application/json'
      }
  });
  console.log("response + info : " + res.info);
  console.log("response : " + JSON.stringify(res.info));
  const json = await res.json();
  const sbcount = json.subscription_count;
  console.log("json : " + JSON.stringify(json));
  console.log("sbcount : " + sbcount);

} catch (err) {
  console.log(err);
}
}

var myVar = null;
const timeCounter = function(x){
  var count;
  myVar = setInterval(myTimer, 1000);
  count = x;
  function myTimer() {
  document.getElementById("timer").innerHTML = "00:"+ count;
      count = count - 1;
      if(count === -1){
      console.log("log Out");
      clearInterval(myVar);
      logOut();
    }
  }
}

function stopTimer() {
  clearInterval(myVar);
}

const handleKey = function(event){
  if (event.keyCode === 13 && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    sendMessage();
  }

  if (event.keyCode === 13 && event.shiftKey) {
    event.preventDefault();
  }

  if (event.altKey && event.keyCode === 13) {
    event.preventDefault();
    var textarea = document.querySelector('#message');
    textarea.value = textarea.value + "\r\n";
  }
}

const logOut = function (){
  stopTimer();
  pusher.unsubscribe(`${groupName}`);
  console.log('You unsubscribed from pusher!');
  localStorage.clear();
  document.querySelector("#input-group").value = " ";
  document.querySelector("#input-name").value = " ";
  document.getElementById("first-screen").style.display = "block"
  document.getElementById("second-screen").style.display = "none"
  location.reload();
};

document.getElementById("join-group").addEventListener("click", joinGroup)

// Example starter JavaScript for disabling form submissions if there are invalid fields
const validatInput = function () {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('click', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
};
