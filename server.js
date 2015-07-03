var express = require('express');
var app = express();
var basicAuth = require('basic-auth');
var bodyParser = require('body-parser');
var _ = require("underscore");
var userAuth = require('./users.js');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var hash = require('./pass').hash; // test


var fs = require('fs');
var port = process.env.PORT || 8080; // set our port

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem') // https keys
};



var https = require('https').createServer(options, app); //create https server

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
    extended: true
})); // to support URL-encoded bodies
app.use(bodyParser.json()); // to support JSON-encoded bodies



app.use(session({
    secret: 'jMarksSecret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}));



app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
//testing

app.use(function(req, res, next) {
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

var users = {
    someone: {
        name: 'someone'
    }
};

// when you create a user, generate a salt                                                                                                                 
// and hash the password ('foobar' is the pass here)                                                                                                                                                                           
hash('foobar', function(err, salt, hash) {
    if (err) throw err;
    // store the salt & hash in the "db"                                                                                                             
    users.someone.salt = salt;
    users.someone.hash = hash.toString();
});

function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);
    var user = users[name];
    // query the db for the given username       
    if (!user) return fn(new Error('cannot find user'));
    // apply the same algorithm to the POSTed password, applying                            
    // the hash against the pass / salt, if there is a match we                              
    // found the user                          
    hash(pass, user.salt, function(err, hash) {
        if (err) return fn(err);
        if (hash.toString() == user.hash) return fn(null, user);
        fn(new Error('invalid password'));
    })
}

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.render('pages/error');
    }
}

app.get('/', function(req, res) {
    res.render('pages/login');
});

app.get('/bookmarks', restrict, function(req, res) {
    
});

app.get('/logout', function(req, res) {
    // destroy the user's session to log them out                                                                                                             
    // will be re-created next request                                                                                                                   
    req.session.destroy(function() {
        res.redirect('/');
    });
});

app.get('/login', function(req, res) {
    res.render('pages/login');
});

app.post('/bookmarks', function(req, res) {

    authenticate(req.body.username, req.body.password, function(err, user) {
        if (user) {
            // Regenerate session when signing in                                                                                                   
            // to prevent fixation                                                                                                                    
            req.session.regenerate(function() {
                // Store the user's primary key                                                                                                              
                // in the session store to be retrieved,                                                                                                                                                                                                                                      
                // or in this case the entire user object                                                                                                     
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                res.render('pages/bookmarks');
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' username and password.' + ' (use "tj" and "foobar")';
            res.render('pages/login');
        }
    });
});


var AWS = require('aws-sdk'); //amazon

AWS.config.update({
    accessKeyId: "xxxxxxxx",
    secretAccessKey: "xxxxxxxxxxx",
    region: 'xxxxxxxxxx'
});

var s3 = new AWS.S3();

app.post('/newBookmark', function(req, res) {
    var rndm = JSON.stringify(_.random(1, 999999999));

    var params = {
        Bucket: 'xxxxxxxxx',
        Key: JSON.stringify(req.body.folder) + rndm + '.json',
        Body: JSON.stringify({
            website: req.body.website,
            title: req.body.title,
            description: req.body.description,
            position: req.body.position,
            created: req.body.created,
            canvas: req.body.canvas
        })
    }
    console.log(req.body)
    s3.putObject(params, function(err, req) {
        if (err) {
            console.log(err);
            console.log('Error uploading data');
        } else {
            console.log('posted!')
        }
    });
});



//gets all within bookmark folder

app.get('/bookmarkList', function(req, res) {
    var params = {
        Bucket: 'xxxxxxxxxxx',
        Prefix: 'bookmarks/',
        Delimiter: '/'
    }

    s3.listObjects(params, function(err, data) {
        res.send(data);
    });
});




app.get('/folder', function(req, res) {

    var params = {
        Bucket: 'xxxxxxxxxxxx',
        Prefix: req.query.folder,
        Delimiter: '/'
    }

    console.log(params);
    s3.listObjects(params, function(err, data) {
        res.send(data);
    });

});

app.get('/fldrContents', function(req, res) {

    var params = {
        Bucket: 'xxxxxxxxxxxx',
        Key: req.query.contents
    }

    s3.getObject(params).on('success', function(response) {

        var b = new Object();

        b.path = response.request.params.Key;
        b.body = response.data.Body.toString();


        res.send(b);

    }).send();
});

app.post('/newFolder', function(req, res) {
    console.log(req.body.folder)
    var params = {
        Bucket: 'xxxxxxxxxxx',
        Key: req.body.folder
    }
    s3.putObject(params, function(err, req) {
        if (err) {
            console.log(err);
            console.log('Error uploading data');
        } else {
            console.log('succesfully uploaded the folder!');
        }
    });
});

app.post('/delete', function(req, res) {

    var params = {
        Bucket: 'xxxxxxxxxx',
        Delete: {
            Objects: [{
                Key: req.body.folder
            }]
        }
    }

    s3.deleteObjects(params, function(err, data) {
        if (err) return console.log(err);


    });

});

app.post('/deleteBookmark', function(req, res) {
    var params = {
        Bucket: 'xxxxxxxxxxxx',
        Delete: {
            Objects: [{
                Key: req.body.folder
            }]
        }
    }

    s3.deleteObjects(params, function(err, data) {
        if (err) return console.log(err);


    });
})

app.post('/cssPosition', function(req, res) {
    var params = {
        Bucket: 'xxxxxxxxxx',
        Key: req.body.folder,
        Body: JSON.stringify({
            website: req.body.website,
            title: req.body.title,
            description: req.body.description,
            position: req.body.position,
            created: req.body.created,
            canvas: req.body.canvas
        })
    }
    //console.log(req.body)
    s3.putObject(params, function(err, req) {
        if (err) {
            console.log(err);

        } else {
            console.log('succesfully uploaded the data!');
        }
    });
});

app.post('/saveEdit', function(req, res) {
    var params = {
        Bucket: 'xxxxxxxxxx',
        Key: req.body.folder,
        Body: JSON.stringify({
            website: req.body.website,
            title: req.body.title,
            description: req.body.description,
            created: req.body.created,
            canvas: req.body.canvas
        })
    }
    console.log(req.body)

    s3.putObject(params, function(err, req) {
        if (err) {
            console.log(err);

        } else {
            console.log('succesfully uploaded the data!');
        }
    });
})
if (!module.parent) {
    https.listen(port);
}