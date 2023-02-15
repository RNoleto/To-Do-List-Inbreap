const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"), 
taskBox = document.querySelector(".task-box");
let editId;
let isEditedTask = false;
//Pegar ToDo-List do localstorage
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = "";
  if(todos) {
    todos.forEach((todo, id) => {
      //Se o status do ToDo estiver completed, setar valor de Completo em isCompleted
      let isCompleted = todo.status == "completed" ? "checked" : "";
      if(filter == todo.status || filter == "all"){
        li += `<li class="task">
        <label for="${id}">
          <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
          <p class="${isCompleted}">${todo.name}</p>
        </label>
        <div class="settings">
          <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
          <ul class="task-menu">
              <li onclick="editTask(${id}, '${todo.name}')"><i class="fa-solid fa-pen"></i>Editar</li>
              <li onclick="deleteTask(${id})"><i class="fa-solid fa-trash"></i>Delete</li>
          </ul>
        </div>
      </li>`;
      }
  });
  }
  taskBox.innerHTML = li || '<span>Você não tem nenhuma tarefa aqui!</span>';
}
showTodo("all");

function showMenu(selectedTask){
  //Seleciona a div da tarefa
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu. classList.add("show");
  document.addEventListener("click", e => {
    // Remove a class show do taskmenu quando clicado
    if(e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu. classList.remove("show");
    }
  });
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
}

function deleteTask(deleteId) {
  // remove a tarefa selecionada da array todos
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
}

clearAll.addEventListener("click", () => {
    // remove todos os itens da array ToDos
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
})

function updateStatus(selectedTask){
  //Pega o paragrafo que contém o nome da tarefa
  let taskName = selectedTask.parentElement.lastElementChild;
  if(selectedTask.checked) {
    taskName.classList.add("checked");
    //Atualizar status da tarefa selecionada para completa
    todos[selectedTask.id].status = "completed";
  }else{
    taskName.classList.remove("checked");
    //Atualizar status da tarefa selecionada para pendente
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
}

taskInput.addEventListener("keyup", e => {
  let userTask = taskInput.value.trim();
  if(e.key == "Enter" && userTask){
    if(!isEditedTask) { //Quando isEditedTask for verdadeiro
      if(!todos){
        //Se ToDo não existir, passar uma array vazia
        todos = [];
      }
      let taskInfo = {name: userTask, status: "pending"};
      todos.push(taskInfo); // Adiciona nova tarefa ao ToDo
    }else{
      isEditedTask = false
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
  }
})