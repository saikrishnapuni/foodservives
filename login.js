const express = require('express');
const mysql = require('mysql');
const nodemailer = require("nodemailer");
let app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var cookieParser = require('cookie-parser')
const flash = require('connect-flash');
var session = require('express-session');
// app.use('/static', express.static(path.join(__dirname, 'public')));
const bcrypt = require('bcryptjs');
const { devNull } = require('os');
const { func } = require('assert-plus');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'miniproject'

});


//...


app.use(session({ cookie: { maxAge: 60000 }, 
                  secret: 'secret',
                  resave: false, 
                  saveUninitialized: false}));
app.use(flash());
app.use('/images',express.static("images"));
db.connect((error)=>{
    if(error){
    console.log(error)}
    else{
        console.log("connected.....")
    }

})


app.get("/",(req,res)=>{
    res.render("signup.ejs")
});
app.post('/submit',async(req,res)=>{
    
    const {email,uname,pass} = req.body;

    const hpass= await bcrypt.hash(pass,10)
    
    console.log(hpass);
    var sql = "insert into users1 values ('"+email+"','"+uname+"','"+hpass+"')";
    db.query(sql,function(err){
     if(err){
         alert("email already exists");
     }
     else{
        res.render("submit.ejs");
     }
    });
    
   
        
    
});
app.get('/login',(req,res)=>{
    res.render('login.ejs')

})

app.post('/order',(req,res)=>{
    const mail = req.body.email;
    const pass  = req.body.pass;
    // var s= "select * from user";
    // db.query(s,function(err,result){
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         var row = result[key];
    //         var x = row.password;
    //         console.log(x);
    //     }
    // })
    var q = "select email  from users1 where email = '"+mail+"'";

    db.query(q,function(error,result,fields){
        if(error){
            req.flash("error",error)
        }
        else{
            // console.log(mail);
           var g = "select password from users1 where email = '"+mail+"'";
           db.query(g,function(error,result,fields){
            if(error){
                req.flash("error",error)
            }
            else{
                Object.keys(result).forEach(function(key) {
                    var row = result[key];
                    
                    var x = row.password;
                    
                    bcrypt.compare(pass,x,function(err,resu){
                        if(resu){
                            console.log(resu)
                            res.render('submit.ejs')
                        }
                        else{
                            req.flash("error","wrong password")
                            
                            res.redirect('/login')
                        }
                    })
                  });
            }
           })
        }
    })
    
    
})
app.get("/reslogin",(req,res)=>{
    res.render('reslogin.ejs')
})
app.get("/rs",(req,res)=>{
    res.render('ressignup.ejs')
})
app.post("/gh",async(req,res)=>{
    const{email,pass,name} = req.body
    console.log(pass)
    const hpass= await bcrypt.hash(pass,10)
    
    console.log(hpass);
    var sql = "insert into hotels values ('"+email+"','"+hpass+"','"+name+"')";
    db.query(sql,function(err){
     if(err){
         alert("email already exists");
     }
     else{
        res.redirect("/reslogin");
     }
    });
    

})
app.post("/hlogin",(req,res)=>{
    const {email,pass} = req.body;
    var q = "select email  from hotels where email = '"+email+"'";

    db.query(q,function(error,result,fields){
        if(error){
            req.flash("error",error)
        }
        else{
            
            
           var g = "select password from hotels where email = '"+email+"'";
           db.query(g,function(error,result,fields){
            if(error){
                req.flash("error",error)
            }
            else{
                
                Object.keys(result).forEach(function(key) {
                    var row = result[key];
                    
                    var x = row.password;
                    
                    bcrypt.compare(pass,x,function(err,resu){
                        
                        if(resu){
                            res.render('submit.ejs')
                        }
                        else{
                            res.redirect(`/menus/${email}`)
                            
                            
                            // req.flash("error","wrong password")
                            
                            // res.redirect('/login')
                        }
                    })
                  });
            }
           })
        }
    })
    
    

})
app.get("/menus/:id",(req,res)=>{
    var name=req.params.id
    console.log(name)
    var q = "select name from hotels where email = '"+name+"'";
    db.query(q,function(err,result,fields){
                                if(err){
                                    console.log(err)
                                    req.flash("error",err)
                                }
                                else{
                                    console.log(result)
                                    var row = result[0];
                                    var x = row.name;
                                    console.log(x)
                                    var g = "select * from ??"
                                    db.query(g,[x],(err,result,field)=>{
                                        if(err){
                                           console.log(err)
                                        }
                                        else{
                                            res.render("menu.ejs",{data:result,email:name,x:x})
                                            
                                        }
                                    })
                                    
                                }
                            })
    
})
app.post("/gg",(req,res)=>{

    const {SNO,ITEM,PRICE,hotelname,email} = req.body
    console.log(req.body)
    var q = "insert into ??(SNO,ITEM,PRICE) values(?,?,?)"
    db.query(q,[hotelname,SNO,ITEM,PRICE],function(err,result){
        if(err){
            console.log(err)
        }
        else{
            console.log("inserted")
            res.redirect(`/menus/${email}`)
        }

    })

})

app.get("/hot",(req,res)=>{
    var q = "select SNO,ITEM,PRICE from hotel1";
    
    
    db.query(q,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            
            res.render('hotel1.ejs',{sampleData:result});
            
        }
    })
})
app.get("/hot1",(req,res)=>{
    var q = "select SNO,ITEM,PRICE from hotel2";
    db.query(q,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            
            res.render('hotel2.ejs',{sampleData:result});
            
        }
    })

})
app.get("/hot2",(req,res)=>{
    var q = "select SNO,ITEM,PRICE from hotel3";
    db.query(q,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            
            res.render('hotel3.ejs',{sampleData:result});
            
        }
    })

})
app.post('/generatebill',(req,res)=>{
    var q = "select SNO,ITEM,PRICE from hotel1";
    var x = "hotel1@gmail.com"
    console.log(x);
    db.query(q,function(err,result){
        if(err){
            console.log(err);
            console.log("error")
        }
        else{
            count = 0
            result.forEach(function(d){
                if(req.body[d.SNO]!=0){
                    count =count+1;
                }
            });
            if(count == 0){
               res.redirect("/hot");
            }
            else{
            res.render('bill1.ejs',{data:result,sampleData:req.body,d:x});
            }
            


        }
    });
});
app.post('/generatebill1',(req,res)=>{
    var q = "select SNO,ITEM,PRICE from hotel2";
    console.log("hello")
    db.query(q,function(err,result){
        if(err){
            console.log(err);
            console.log("error")
        }
        else{
            
            count = 0
            result.forEach(function(d){
                if(req.body[d.SNO]!=0){
                    count =count+1;
                }
            });
            if(count == 0){
               res.redirect("/hot");
            }
            else{
            res.render('bill1.ejs',{data:result,sampleData:req.body});
            }
            


        }
    });
});
app.post('/generatebill3',(req,res)=>{
    var q = "select SNO,ITEM,PRICE from hotel3";
    console.log("hello")
    db.query(q,function(err,result){
        if(err){
            console.log(err);
            console.log("error")
        }
        else{
            
            count = 0
            result.forEach(function(d){
                if(req.body[d.SNO]!=0){
                    count =count+1;
                }
            });
            if(count == 0){
               res.redirect("/hot");
            }
            else{
            res.render('bill1.ejs',{data:result,sampleData:req.body});
            }
            


        }
    });
});
app.post('/pdf',async(req,res)=>{
    const s = req.body.billx
    
    try{
    let transporter = await nodemailer.createTransport({
        service:'Gmail',
        auth: {
          user: 'punisaikrishna@gmail.com', 
          pass: 'olflxddflllbrzpo', 
        },
      });
     await transporter.sendMail({
        from: "punisaikrishna@gmail.com", // sender address
        to: "dp15072003@gmail.com", // list of receivers
        subject: "order", // Subject line
         // plain text body
        html: s, // html body
      });
    res.render("ok.ejs");
    }
    catch(err){
        console.log(err)
    }
})
app.get("/back",(req,res)=>{
    res.redirect("/login")
})
app.listen(3000,()=>{
    
    console.log("server started");
})