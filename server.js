const express = require('express');

const server = express(); //SERVER INSTANCE JISKE UPR LISTEN KREENGE
const path = require('path'); //

const { v4: uuid } = require('uuid');//version 4 

const fs = require('fs'); //all the module import
//middleware use
server.use(express.static("public/"))//middleware//automatically deliever the static file//simply path dena pdega
server.use(express.json())
server.use(express.urlencoded())//url kai andr data bhejte hai encode krke 

server.use((req, res, next) => {
    console.log(req.url);
    console.log(req.method);//which method i have used
    console.log(req.body);//kya data aya hai
    next();//next is used to execute the routers.
})
//routers i have used

server.get("/", (req, res) => {//client ki req
    res.sendFile(path.resolve("views/todo.html"))//todo list send //server nai response bheja
})
server.get("/todo", (req, res) => {
    const data = readFile(path.resolve("filetodo.json"))
    console.log(data);
    res.status(200).json(data)
})
server.post("/todo", (req, res) => {
    const todo = {
        id: uuid(), //universal unique id.
        task: req.body.todo, //task is added every time.
        status: false //pending state
    }
    writefile(todo, path.resolve("filetodo.json"))//readable format mai
    res.json(todo) 
})

server.delete("/todo", (req, res) => {
    const id = req.query.id 
    deleteTodoFromFile(id, path.resolve("filetodo.json"))
    res.status(200).end()
})

server.put("/todo",editTodo)

server.patch("/todo", (req, res) => {
    fs.readFile(path.resolve("filetodo.json"), "utf-8", (err, data) => {
        if (err) {
            res.status(500).end()//internal server error//unexpexted condition occured
        }
        if (data) {
            let arr = JSON.parse(data);//array mil gyi
            const index = arr.findIndex((todo) => {
                return todo.id == req.query.id;
            })
            arr[index].status = !arr[index].status;//array kai andr changes hue hai 
            fs.writeFile(path.resolve("filetodo.json"), JSON.stringify(arr, null, 2), (err) => {
                if (err) {
                    res.status(500).end();
                }
                res.status(200).end();
            })//then un changes ko file mai save krwa rhe hai
        }
    })
})

function writefile(todo, file) {
    const data = readFile(file)//read ki 
    console.log(data);
    data.push(todo)
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
    console.log("File updated");
}
function readFile(file) {
    const data = fs.readFileSync(file, "utf-8")
    if (data) {
        const arr = JSON.parse(data)//
        return arr
    }
    return []
}

function deleteTodoFromFile(id, file) {
    const data = readFile(file)
    const index = data.findIndex(todo => {
        return todo.id == id
    })
    if (index < 0) {
        return "Todo not exists"
    }
    const newArr = data.filter(todo => {
        return todo.id != id//
    })
    fs.writeFileSync(file, JSON.stringify(newArr, null, 2))
    console.log("Todo deleted");
}

function editTodo(req, res) {
    const id = req.query.id;
    const task = req.body.todo;

   // console.log(id);
    //console.log(task);
    let data = readFile(path.resolve("filetodo.json"))
    const index = data.findIndex((value) => {
        return value.id == id;//match the id 
    })
    data[index].task = task;

    fs.writeFile(path.resolve("filetodo.json"), JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.log(err);
            res.status(500).end()
        } else {
            res.status(200).json(data[index])
        }
    })
}

server.listen(2000, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Server id successfully started ");
    }
})