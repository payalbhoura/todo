const container = document.getElementById("contain");
//console.log(container);
window.addEventListener("load", (event) => {
    fetch("http://localhost:2000/todo")
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            console.log(data);
            data.forEach(element => {
                container.appendChild(createToDoItem(element))
            });
        })
        .catch((err) => {
            console.log(err);
        });//get method 
})

const inp = document.getElementById("inp");
const btn = document.getElementById("btn");


btn.addEventListener("click", () => {
    // console.log("hlo");
    if (inp.value == "") {
        alert("Enter some data to make task ")
        return
    }
    const data = inp.value;
    fetch("http://localhost:2000/todo", {
        method: "post",
        headers: {
            'content-type': "application/json"
        },
        body: JSON.stringify({ todo: data })
    })//req 
        .then(res => res.json())
        .then(data => {
            container.appendChild(createToDoItem(data))
            inp.value = ""
        }).catch(err => console.log(err))

})


function createToDoItem(data) {
    // console.log("object");
    const toDo = document.createElement("div");
    toDo.id = "con-" + data.id;
    toDo.className = "todo-item";
    const p = document.createElement("p");
    p.id = "p-" + data.id
    if (data.status) {
        p.innerHTML = `<strike> ${data.task} </strike>`
    }
    else {
        p.innerText = data.task;
    }
    //console.log(p);
    toDo.appendChild(p)

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox";
    checkbox.id = "chk-" + data.id
    checkbox.addEventListener("change", () => {
        marktodo(data.id)
    })
    checkbox.checked = data.status;

    const div = document.createElement("div");
    div.innerHTML = `
                     <button onclick="deleteTodo('${data.id}')">x</button>
                     <button onclick="editTodo('${data.id}')">edit</button>`
    div.appendChild(checkbox)
    toDo.appendChild(div)
    return toDo;
}
function marktodo(id) {
    console.log("PATCH", id);
    fetch("http://localhost:2000/todo?id=" + id, {
        method: "PATCH"
    }).then((result) => {
        if (result.status == 200) {
            const checkbox = document.getElementById(`chk-${id}`)
            const p = document.getElementById(`p-${id}`)
            if (checkbox.checked) {
                const text = p.innerText;
                p.innerHTML = `<strike>${text} </strike>` //tag
            }
            else {
                const text = p.innerText;
                p.innerHTML = text;
            }
        }
    }).catch((err) => {
    });
}

function deleteTodo(id) {
    fetch("http://localhost:2000/todo?id=" + id, {//query parameter
        method: "delete",
    })
        .then((result) => {
            if (result.status == 200) {
                const todoItem = document.getElementById("con-" + id)
                todoItem.remove()
            } else {
                alert("Something went wrong")
            }
        }).catch((err) => {
            console.log(err);
        });
}

function editTodo(id) {
    const editnew = prompt("enter the new dtata==>")
    if (editnew == "") {
        alert("Enter some data in task")
        return
    }
    console.log(editnew);
    fetch("http://localhost:2000/todo?id=" + id, {//query parameter
        method: "put",
        headers: {
            'content-type': "application/JSON"
        },
        body: JSON.stringify({ todo: editnew })
    })
        .then((result) => {
            if (result.status == 200) {
                return result.json()
            }
            else {
                console.log("error occured");
            }
        })
        .then(data => {
            const todoItem = document.getElementById("p-" + id)
            if (data.status) {
                todoItem.innerHTML = `<strike>${data.task}</strike>`
            } else {
                todoItem.innerText = data.task
            }
        })
        .catch(err => {
            alert("error occured")
        })
}
