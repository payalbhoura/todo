const path =require("path");//import
function loadhomepage(req,res){
 res.sendFile(path.resolve("todo.html"));
}
module.exports={loadhomepage}//export
