const express = require('express');
const app = express();
const port = 5500;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser());
app.use(session({
    secret: 'vjBtHJhjn468@TYVHB2dcBVHBbh^n7v',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    }
}))

app.use('/auth', authRoute);
app.use('/user', (req, res, next) => {
    if (req.session.username) {
        next();
    }
    else {
        res.redirect('/auth/errorPage');
    }

});
app.use('/user', userRoute);

app.get('/dashboard.html', (req, res, next) => {
    if (req.session.username) {
        next();
    }
    else {
        res.redirect('/auth/errorPage');
    }
})

app.use(express.static("public"));

app.listen(port, () => {
    console.log("server is listening");
})