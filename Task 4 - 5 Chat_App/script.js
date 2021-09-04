"use strict";

var app_id = "1260724"
var key = "6efbf5b719e8e1f20af7"
var secret = "2585e5600b8e858ca41e"

var groupName ;
var userName ;
var user_id;
var userLocalName;
var userInfo = {};
var pusher;


console.log("groupName : " + groupName + "\n" + "userName : " + userName );

function getMD5(body){
  return CryptoJS.MD5(JSON.stringify(body));
};

function getAuthSignature(md5,timeStamp){
  return CryptoJS.HmacSHA256(`POST\n/apps/1260724/events\nauth_key=${key}&auth_timestamp=${timeStamp}&auth_version=1.0&body_md5=${md5}`,`${secret}`);
};

//////////////////////////////////////////////////
function getAuthSignature2(timeStamp){
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
  channel.bind("my-event",function(data) {
    //alert(JSON.stringify(data));
    console.log("user Id : " + data.user_id);
    let msgContainer = document.getElementById("msgBlock");
    let newParagraph = document.createElement("P");
    if(localStorage.getItem("userId") == data.user_id){
      newParagraph.className = "border mb-2 pt-2 ps-2 pb-3 pe-3 w-75 float-end";
      newParagraph.innerHTML = `<span id="user-name">You </span>: <span id="user-message">${data.send_message}</span>`;
    }else{
      newParagraph.className = "border mb-2 pt-2 ps-2 pb-3 pe-3 w-75 float-start";
      newParagraph.innerHTML = `<span id="user-name">${data.userLocalName}</span>: <span id="user-message">${data.send_message}</span>`
    }
    msgContainer.appendChild(newParagraph);
  });


  }
}

var sendMessage = async function(){
  let send_message = document.getElementById("message").value;
  if( send_message !== ''){
  //let obj = {send_message : `${send_message}`, id : `${user_id}`};
  userInfo = {
    userLocalName: userLocalName,
    user_id: user_id,
    send_message: send_message
  };
// `${groupName}`
// `${userName}`
console.log("id : " + user_id + " Local userId " + localStorage.getItem("userId"));
  let body = {data:`${JSON.stringify(userInfo)}`,name:"my-event",channel:`${groupName}`};
  let timeStamp = Date.now()/1000;
  let md5=getMD5(body);
  let url =`https://cors.bridged.cc/https://api-ap2.pusher.com/apps/1260724/events?body_md5=${md5}&auth_version=1.0&auth_key=${key}&auth_timestamp=${timeStamp}&auth_signature=${getAuthSignature(md5,timeStamp)}`;
  let req = await fetch(url,{
      method:'POST',
      body:JSON.stringify(body),
      headers:{
          'Content-Type':'application/json'
      }
  });
  //timeCounter(59,1);
  myStopFunction();
  timeCounter(59);
  }
}

var countUsers = async function(){  
  // GET /apps/[app_id]/channels/[channel_name]/users

  //let body = {data:`${JSON.stringify(userInfo)}`,name:"my-event",channel:`${groupName}`};
  let timeStamp = Date.now()/1000;
  //let md5=getMD5(body);

  //let url =`https://api-ap2.pusher.com/apps/1260724/channels`;
  let url =`https://cors.bridged.cc/https://api-ap2.pusher.com/apps/1260724/channels/${groupName}?auth_version=1.0&auth_key=${key}&auth_timestamp=${timeStamp}&auth_signature=${getAuthSignature2(timeStamp)}`;

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
function myStopFunction() {
  clearInterval(myVar);
}

const logOut = function (){
  document.getElementById("first-screen").style.display = "block"
  document.getElementById("second-screen").style.display = "none"
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