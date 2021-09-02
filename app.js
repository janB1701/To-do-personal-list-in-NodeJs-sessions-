const express = require ('express');
const session = require ('express-session');
const path = require ('path');
const bodyParser = require ('body-parser');

const app = express ();

const users = [
    { name: 'sampleName', email: 'w@w', password: 'secret' }
];

app.use (bodyParser.urlencoded ({ extended:false }));
app.use (session({
    secret: "topSecret"
}));
app.set ('views', path.join (__dirname, 'views'));
app.set ('view engine', 'ejs');

const redirectLogin = (req, res, next) => {
    if (!req.session.email) {
        res.redirect ('/login');
    }else {
        next();
    }
}

const redirectHome = (req, res, next) => {
    if (req.session.email){
        res.redirect ('/')
    }else {
        next();
    }
}

app.get ('/', redirectLogin, (req, res) => {
    console.log (users);
    let no1 = parseInt(req.session.numVisits);
    no1 += 1;
    req.session.numVisits = no1;
    console.log (req.session.email);
    res.render ('welcome', {
        name: req.session.name
        
    })
})

app.get ('/login', redirectHome, (req, res) => {
    res.render ('login', {
        error: ''
    });
});

app.post ('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (email && password) {
        const user = users.find (
            user => user.email === email && user.password === password
        )
        if (user) {
            req.session.email = email;
            req.session.name = user.name;
            res.redirect ('/');
        }else {
            res.redirect ('/login');
        }
    }

})

app.get ('/register', (req, res) => {
    res.render ('register');
});

app.post ('/register', (req, res) => {
    let fullname = req.body.fullname;
    let email = req.body.email;
    let password1 = req.body.password;
    let password2 = req.body.password2;
    let error = '';

    if (email && password1 && password2) {
        const exist = users.some (
            user => user.email === email 
        );
        if (!exist) {
            console.log ("user doesnt ecist");
            if (password1 === password2) {
                console.log ('usao');
                let user = { name: fullname, email: email, password: password1 }
                users.push (user);
                req.session.email = email;
                req.session.name = fullname;
                res.redirect ('/')
            }else {
                error += 'passwords dont match';
                res.redirect ('/register');
            }
        }else {
            error += 'email allready teaken';
            res.redirect ('/register');
        }
    }else {
        error += ' enter all inputs'
        res.redirect ('/register');
    }
    console.log ("err > " + error);
})

app.listen (3000);