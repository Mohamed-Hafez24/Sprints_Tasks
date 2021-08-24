"use strict";
let tasks = [];

const getPriorityName = function (priority) {
  switch (priority) {
    case "1":
      return "High";
    case "2":
      return "Medium";
    case "3":
      return "Low";
    default:
      return "";
  }
};

const deleteTask = function (i) {
  if (!confirm("Are you sure ?")) return;
  tasks.splice(i, 1);
  renderTable();
};

const editTask = function (i) {
  let row = document.querySelector(`#row${i + 1}`);
  row.getElementsByClassName("save")[0].style.display = "unset";
  row.getElementsByClassName("cancel")[0].style.display = "unset";
  let tName = row.getElementsByClassName("taskName")[0].innerText;
  row.getElementsByClassName("taskName")[0].innerHTML =`<input type="text" class="edit_name" class="form-control" value="${tName}"/>`;
  //let priority = row.getElementsByClassName("taskPriority")[0].innerText;
  row.getElementsByClassName("taskPriority")[0].innerHTML =`<select  class="edit_priority form-control">
                                                              <option value="1">High</option>
                                                              <option value="2">Medium</option>
                                                              <option value="3">Low</option>
                                                            </select>`;

};

/*
I tryed to avoid rendring the page after cancel or save the edits, 
So I can edit multiple tasks at the same time 
*/
const cancelEdit = function(i){
  let row = document.querySelector(`#row${i + 1}`);

  row.getElementsByClassName("taskName")[0].innerHTML = `<td class="taskName">${tasks[i].name}</td>`;
  row.getElementsByClassName("taskPriority")[0].innerHTML = `<td class="taskPriority">${getPriorityName(tasks[i].priority)}</td>`;

  row.getElementsByClassName("save")[0].style.display = "none";
  row.getElementsByClassName("cancel")[0].style.display = "none";
};

const saveEdit = function(i){
  let row = document.querySelector(`#row${i + 1}`);
  let newName = row.getElementsByClassName("taskName")[0].getElementsByClassName("edit_name")[0].value;
  let newPriority = row.getElementsByClassName("taskPriority")[0].getElementsByClassName("edit_priority")[0].value;
  if (newName !== "" && newPriority > 0) {
    row.getElementsByClassName("taskName")[0].innerHTML = `<td class="taskName">${newName}</td>`;
    row.getElementsByClassName("taskPriority")[0].innerHTML = `<td class="taskName">${getPriorityName(newPriority)}</td>`;
    tasks[i].name = newName;
    tasks[i].priority = newPriority;
  }else{
    return editTask(i);
  }
  row.getElementsByClassName("save")[0].style.display = "none";
  row.getElementsByClassName("cancel")[0].style.display = "none";
};

const moveUp = function (i) {
  if (i == 0) return;
  const oldTask = tasks[i];
  tasks[i] = tasks[i - 1];
  tasks[i - 1] = oldTask;
  renderTable();
};
const moveDown = function (i) {
  if (i == tasks.length - 1) return;
  const oldTask = tasks[i];
  tasks[i] = tasks[i + 1];
  tasks[i + 1] = oldTask;
  renderTable();
};

const renderTable = function () {
  const tbody = document.querySelector("#tasks_tbody");
  tbody.innerHTML = "";
  tasks.forEach((t, i) => {
    const row = `
        <tr id="row${i + 1}">
        <td>${i + 1}</td>
        <td class="taskName">${t.name}</td>
        <td class="taskPriority">${getPriorityName(t.priority)}</td>
        <td>
        ${
          i > 0
            ? `<button class="btn btn-sm btn-secondary" onclick="moveUp(${i})">Up</button>`
            : ``
        }
        ${
          i < tasks.length - 1
            ? `<button class="btn btn-sm btn-secondary" onclick="moveDown(${i})">Down</button>`
            : ``
        }
        </td>
        <td>
        <button class="save btn btn-success btn-sm "  style="display:none;" onclick="saveEdit(${i})">Save</button>
        <button class="cancel btn btn-danger btn-sm " style="display:none;" onclick="cancelEdit(${i})">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="editTask(${i})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTask(${i})">Delete</button></td>
        </tr>
        `;
    tbody.insertAdjacentHTML("beforeEnd", row);
  });
};

const addTask = function () {
  console.log(this);
  const taskName = document.querySelector("#task_name").value;
  const priority = document.querySelector("#task_priority").value;
  if (taskName !== "" && priority > 0) {
    tasks.push({
      name: taskName,
      priority: priority,
    });
    renderTable();
  }
};

document.querySelector("#add").addEventListener("click", addTask);


/*
var name = "Test3";
var age = 22;
const calcFunction = () => {
  console.log(this);
  console.log(`My name is ${this.name} I'm ${this.age} years old`);
};

const obj = {
  name: "Test",
  age: 35,
  cal: calcFunction,
};

const obj2 = {
  name: "Test2",
  age: 22,
  cal: calcFunction,
};

function thisTest() {
  let obj1 = "Ramy";
  var obj2 = "Ahmed";
  console.log(this);
  const x = () => {
    console.log(this);
  };
  x();
}
*/