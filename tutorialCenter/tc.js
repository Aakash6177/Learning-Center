function homeScreen(req,res){
    res.end("Hello");
}
function allSubjects(req,res){
    res.json();
}


module.exports = {homeScreen };
