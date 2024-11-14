const express = require('express');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const ws = require('ws');
//const bodyParser = require('body-parser');
const UserModel = require('./models/User.js');

dotenv.config();
mongoose.connect(process.env.MONGO_URL);

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json())
app.use(express.json());
app.use(cookieParser());

app.get('/profile', (req, res) => {
    const token = req.cookies?.token;

    if(token)
    {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if(err) throw err;

            res.json(userData);
        })
    }else{
        res.status(401).json('no token');
    }
})

app.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    const hashedPass = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await UserModel.create({email, username, password: hashedPass});
    jwt.sign({userId: createdUser._id, username: username, email: email}, jwtSecret, (err, token) => {
        if(err) throw err;
        res.cookie('token', token, {secure: true, sameSite: 'none',}).status(201).json({id: createdUser._id});
    });
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const foundUser = await UserModel.findOne({email});

    if(foundUser)
    {
        const passok = bcrypt.compareSync(password, foundUser.password);
        if(passok)
        {
            jwt.sign({userId: foundUser._id, username: foundUser.username, email: foundUser.email}, jwtSecret, (err, token) => {
                if(err) throw err;
                res.cookie('token', token, {secure: true, sameSite: 'none',}).status(201).json({id: foundUser._id, username: foundUser.username});
            });
        }else{
            res.json("incorrect password");
        }
    }else{
        res.json("email not found");
    }
});


const server = app.listen(4040);

const wss = new ws.WebSocketServer({server});

wss.on('connection', (connection, req) => {
    const token = req.headers.cookie.split(';').find((str) => {return str.startsWith('token=')}).split('=')[1];
    
    if(token)
    {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if(err) throw err;

            connection.username = userData.username;
            connection.userId = userData.userId;
            connection.email = userData.email;

            var onlineUsers = [];

            wss.clients.forEach((socket) => {
                onlineUsers.push({username: socket.username, email: socket.email, userId: socket.userId});
            })
            const msg = {type: "online-users", data: onlineUsers}
            connection.send(JSON.stringify(msg));
        });
    }else{
        connection.close(401, "non-existent authentication token");
    }

    connection.on('message', (msg) => {
        const message = JSON.parse(msg);
        switch (message.type) {
            case 'search-username':
                handleSearchUsername(message, connection);
                break;
            case 'add-friend':
                handleAddFriend(message, connection);
                break;
            default:
                break;
        }
    });
});

const handleSearchUsername = async (msg, ws) => {
    const searchStr = msg.data;
    const results = await UserModel.find({
        username: { $regex: searchStr, $options: 'i' }});
    var searchResults = [];
    results.forEach((user) => {
        searchResults.push({userId: user._id, username: user.username, email: user.email});
    });

    ws.send(JSON.stringify({type: "search-results", data: searchResults}));
}

const handleAddFriend = async (msg, ws) => {
    var foundUser = await UserModel.findOne({_id: ws.userId});
    console.log(foundUser);
    foundUser.friends.push(msg.data.userId);
    await foundUser.save();
}

//3ss1ajwQMpDtJ9Os