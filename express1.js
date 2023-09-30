var express = require('express')  
var app = express()  
app.set("view engine", "ejs");
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const request = require('request');

var serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});
app.use('/images', express.static('images'))
const db = getFirestore();
app.get('/', function (req, res) {  
    res.sendFile(__dirname+'/home.html') 
}) 

// app.get('/login', function (req, res) {  
//     res.sendFile(__dirname+'/new.html')  
// })
// app.get('/home', function (req, res) {  
// res.sendFile(__dirname+'/home.html')  
// })  
// app.get('/signup', function (req, res) {  
//     res.sendFile(__dirname+'/signup.html')  
// }) 
// app.get('/login', function (req, res) {  
//     res.sendFile(__dirname+'/login.html')  
// }) 
app.get('/registersubmit', function (req, res) {
            db.collection("Webopedia").add({
                rn:req.query.rn,
                rmail:req.query.rmail,
                rpw:req.query.rpw,
             })
                .then(()=>{
                    res.sendFile(__dirname+'/new.html');
                })
          
    
}) 
app.get('/loginsubmit',function(req,res){
    const lmail = req.query.lmail;
    const lpw = req.query.lpw;
    db.collection("Webopedia")
        .where("rmail", "==", lmail)
        .where("rpw", "==", lpw)
        .get()
        .then((docs) => {
            if(docs.size>0){
                res.sendFile(__dirname+'/new.html');
            }
            else{
                res.sendFile(__dirname+'/register1.html');
            }
})
})
app.get('/startedsubmit', function (req, res){  
    res.sendFile(__dirname+'/register.html') 
})
app.get('/homesubmit', function (req, res) {  
    res.sendFile(__dirname+'/home.html') 
})
app.get('/aboutsubmit', function (req, res) {  
    res.sendFile(__dirname+'/profile.html') 
})
app.get('/quizsubmit', function (req, res) {  
    res.sendFile(__dirname+'/quiz.html') 
})
app.get('/reviewsubmit', function (req, res) {  
    res.sendFile(__dirname+'/star.html') 
})
app.get('/button1submit', function (req, res) {  
    res.sendFile(__dirname+'/html1.html') 
}) 
app.get('/button2submit', function (req, res) {  
    res.sendFile(__dirname+'/css1.html') 
}) 
app.get('/buttonsubmit4', function (req, res) {  
    res.sendFile(__dirname+'/css2.html') 
})
app.get('/buttonsubmit5', function (req, res) {  
    res.sendFile(__dirname+'/new.html') 
})
app.get('/buttonsubmit1', function (req, res) {  
    res.sendFile(__dirname+'/html2.html') 
})
app.get('/buttonsubmit2', function (req, res) {  
    res.sendFile(__dirname+'/html3.html') 
})
 app.get('/buttonsubmit3', function (req, res) {  
   res.sendFile(__dirname+'/new.html') 
 })
app.listen(3000, function () {  
console.log('Example app listening on port 3000!')  
})