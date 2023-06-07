// const express = require('express')
// const app = express()
// // const client = require('mongodb').MongoClient
// const mongoose = require('mongoose')
// const User = require('./userSchema.js')
// const path = require('path')

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // let dbinstance;
// app.get("/", async (req, res) => {

//     // await client.connect("mongodb+srv://rashmika:3882@cluster0.dxpgbzg.mongodb.net/?retryWrites=true&w=majority/")
//     //     .then((database) => {
//     //         dbinstance = database.db("sample_airbnb")        // database name
//     //         console.log("Connected to the database");
//     //     }).catch((err) => {
//     //         console.log("Error in connecting with the database: ", err);
//     //     })

//     // dbinstance.collection('listingsAndReviews')          // collection name
//     //     .find({}).limit(10).toArray()
//     //     .then(arr => {
//     //         console.log(arr)
//     //         res.end("Check console")
//     //     })
//     //     .catch(err => console.log(err));
//     mongoose.connect('mongodb+srv://rashmika1168:2011981168@stproject.neio9cv.mongodb.net/?retryWrites=true&w=majority')
//         .then(() => {
//             console.log("connected to database")
//             res.sendFile(path.join(__dirname, "./public/home.html"))
//         })
//         .catch(err => console.log(err))

// })

// app.get('/login', (req, res) => {
//     res.sendFile(path.join(__dirname, "./public/login.html"))
// })

// app.post('/login', async(req, res) => {
//     let obj = {
//         email: req.body.email,
//         password: req.body.password
//     }
//     await user.find({ name: 'john', age: { $gte: 18 } }).exec();
//     let user = new User(obj);
//     user.save().then(result => {
//         console.log(result);
//         res.redirect('/login');
//     });
// })

// app.get('/signup', (req, res) => {
//     res.sendFile(path.join(__dirname, "./public/signup.html"))
// })

// app.post('/signup', (req, res) => {
//     let obj = {
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password
//     }
//     let user = new User(obj);
//     user.save().then(result => {
//         console.log(result);
//         res.redirect('/login');
//     });
// })

// app.listen(3000, (err) => {
//     if (err)
//         console.log(err);
//     else
//         console.log('Server running at http://localhost:3000/');
// })

/////////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const app = express();
// const fs = require('fs');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const User = require('./models/User');
const Token = require('./models/Token');
const UserRoutes = require('./routes/userRoutes')

const connectionstr = 'mongodb+srv://u1181:admin@cluster0.hjqegxc.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(connectionstr);
mongoose.connection.on('connected', async function () {
    console.log('Mongoose connection open')
    // await new User({username : 'dummyUsn'}).save()
})

app.set('view engine', 'ejs');

app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: '6789wshdjfnjdsyt678w9q',
    saveUnitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))
app.use(cookieParser())
app.use("/user", UserRoutes)

app.get('/', (req, res) => {
    res.render("signup");
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/dashboard', async (req, res) => {
    if (req.session.usn == undefined) {
        res.redirect('/login');
    }
    else {
        const token = req.cookies['connect.sid']
        console.log(token)
        const usersArr = await User.find({}).limit(2);
        const user = await User.findOne({ username: req.session.usn })
        const image = user.userImage
        res.render('dashboard', { name: req.session.usn, image: "/uploads/" + image, usersArr: usersArr })
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login');
})

app.post('/addUser', async (req, res) => {
    try {
        const userData = req.body;
        console.log(typeof (userData));
        console.log(userData);

        console.log('Username ' + req.body.usn);

        const existingUser = await User.findOne({ username: userData.usn })

        if (existingUser) {
            res.status(400).json({ error: true, message: "User already exists!" })
            return;
        }

        const user = await new User({
            username: userData.usn,
            name: userData.name,
            email: userData.email,
            password: userData.pwd
        }).save()
        res.status(200).json({ message: "User registered!" })
        // fs.readFile('./users.json', (err, data) => {
        //     const users = JSON.parse(data.toString());
        //     console.log(users);
        //     const userExists = users.filter((usr) => {
        //         console.log('usr usn ' + usr.usn)
        //         if (usr.usn == userData.usn) {
        //             return true;
        //         }
        //     })

        //     console.log(userExists);

        //     if (userExists.length == 1) {
        //         res.status(400).json({ message: "User Exists!" })
        //     }
        //     else {
        //         const newUser = {
        //             usn: req.body.usn,
        //             name: req.body.name,
        //             email: req.body.email,
        //             pwd: req.body.pwd
        //         }

        //         users.push(newUser)
        //         fs.writeFile('./users.json', JSON.stringify(users), (err) => {
        //             if (err) {
        //                 console.log(err.message)
        //             }
        //             else {
        //                 res.status(200).json({ message: "User registered!" })
        //             }
        //         })
        //     }
        // })
    }
    catch (e) {
        console.log(e.message)
    }
})

app.post('/authenticateUser', async (req, res) => {
    const userData = req.body;
    console.log(userData);

    const existingUser = await User.findOne({ username: userData.usn })

    if (!existingUser) {
        res.redirect('/');
        return;
    }

    if (userData.pwd == existingUser.password) {
        req.session.usn = userData.usn;
        const token = req.cookies['connect.sid']
        await new Token({ username: userData.usn, token: token }).save()
        res.redirect('/dashboard')
    }
    else {
        res.status(400).json({ error: true, message: "Invalid credentials!" })
    }
    // fs.readFile('./users.json', (err, data) => {
    //     if (err) {
    //         console.log(err.message)
    //     }
    //     else {
    //         const users = JSON.parse(data.toString())
    //         const userExists = users.filter((usr) => {
    //             if (usr.usn == userData.usn) {
    //                 return true;
    //             }
    //         })

    //         if (userExists.length == 1) {
    //             const checkUser = userExists.filter((usr) => {
    //                 if (usr.pwd == userData.pwd) {
    //                     return true;
    //                 }
    //             })

    //             if (checkUser.length == 1) {
    //                 req.session.usn = userData.usn;
    //                 res.redirect('/dashboard')
    //             }
    //             else {
    //                 res.status(400).json({ message: "Invalid credentials!" })
    //             }
    //         }
    //         else {
    //             res.redirect('/');
    //         }
    //     }
    // })
})

app.listen(3000, () => {
    console.log("Server Started!");
})

//////////////////////////////////////////////////////////////////////////////////////

// const multer = require("multer");

// const mstorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/files");
//     },
//     filename: (req, file, cb) => {
//         console.log(file);
//         const ext = file.mimetype.split("/")[1]
//         cb(null, req.session.username + "." + ext)
//     }
// })

// const filter = (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     if (ext == "png")
//         cb(null, true);
//     else
//         cb(new Error("File not supported"), false);
// }

// const upload = multer({ storage: mstorage, fileFilter: filter });

// app.post("/uploadfile",upload.single("pic") ,(req,res)=>{

//     res.redirect("/dashboard")

// })

///////////////////////////////////////////////////////////////////////////

// app.post("/storeData",(req,res)=>{

//     let obj={"name":req.body.name,"age":req.body.age};
//     dbinstance.collection("Students").insertOne(obj).then((result)=>{
//         console.log(result);
//         //res.render("home",{data:result});
//         res.redirect("/getData");
//     })
// })
// app.get("/viewData/:id",(req,res)=>{

//     //console.log(req.params.id);
//     dbinstance.collection("Students").findOne({"_id":new Objid(req.params.id)}).then(result=>{

//         res.render("Student",{data:result});

//     });





// })

// app.get("/updateData/:id",(req,res)=>{

//     //console.log(req.params.id);
//     dbinstance.collection("Students").findOne({"_id":new Objid(req.params.id)}).then(result=>{

//         res.render("UpdateStudent",{data:result});

//     });
// });
// app.post("/updateData",(req,res)=>{
// //update Students set Name=req.body.name,age=req.body.age where _id=req.body.id

//     dbinstance.collection("Students").updateOne({"_id":new Objid(req.body.id)},{$set:{"name":req.body.name,"age":req.body.age}});
//     res.redirect("/getData");


// })

{/* <form action="/uploadfile" method="post" enctype="multipart/form-data">
            <input type="file" name="pic"/>
            <input type="submit"/>


        </form> */}