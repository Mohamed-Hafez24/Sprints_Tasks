"use strict";


const groupInput = function () {
  console.log("Group Input");
};

const nameInput = function () {
  console.log("Name Input");
};

const joinGroup = function () {
  console.log("Join Group Button");
  openChatWindow();
};

const logOut = function () {
  console.log("logOut Button");
  loginWindow();
};

const messageBox = function () {
  console.log("Message Box Active");
};

const sendMessage = function () {
  console.log("Send Message Button");
};

//document.getElementById("message").addEventListener("keypress", myScript);

const openChatWindow = function (){
  document.getElementById("first-screen").style.display = "none"
  document.getElementById("second-screen").style.display = "block"
};

const loginWindow = function (){
  document.getElementById("first-screen").style.display = "block"
  document.getElementById("second-screen").style.display = "none"
};

document.getElementById("join-group").addEventListener("click", joinGroup)
