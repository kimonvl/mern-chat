// @ts-nocheck
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
const MessageModel = require('./models/Message.js');
const ConversationModel = require('./models/Conversation.js');

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
    
    try {
        const createdUser = await UserModel.create({email, username, password: hashedPass});
        jwt.sign({userId: createdUser._id.toString(), username: username, email: email}, jwtSecret, (err, token) => {
            if(err) throw err;
            res.cookie('token', token, {secure: true, sameSite: 'none',}).status(201).json({id: createdUser._id});
        });
    } catch (error) {
        console.error(error);
    }   
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const foundUser = await UserModel.findOne({email});
        if(foundUser){
            const passok = bcrypt.compareSync(password, foundUser.password);
            if(passok){
                jwt.sign({userId: foundUser._id.toString(), username: foundUser.username, email: foundUser.email}, jwtSecret, (err, token) => {
                    if(err) throw err;
                    res.cookie('token', token, {secure: true, sameSite: 'none',}).status(201).json({id: foundUser._id, username: foundUser.username});
                });
            }else{
                res.json("incorrect password");
            }
        }else{
            res.json("email not found");
        }
    } catch (error) {
        console.error(error);
        res.json("error finding user");
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '', {expires: new Date(0), secure: true, sameSite: 'none',}).json('logout ok');
});

const server = app.listen(4040);

const wss = new ws.WebSocketServer({server});
console.log("beginning", wss.clients.size);
wss.on('connection',  (connection, req) => {
    var token = null;
    if(req.headers.cookie)
    {
        token = req.headers.cookie.split(';').find((str) => {return str.startsWith('token=')}).split('=')[1];
    }
        
    if(token)
    {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if(err) throw err;
            connection.username = userData.username;
            connection.userId = userData.userId;
            connection.email = userData.email;

            var onlineFriends = await findOnlineFriendsConversations(connection.userId, wss.clients);

            const msg = {type: "online-users", data: onlineFriends}
            connection.send(JSON.stringify(msg));
        });
    }else{
        connection.close(1000, "non-existent authentication token");
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
            case 'send-message':
                handleSendMessage(message, connection);
                break;
            case 'request-conversation':
                handleRequestConversation(message, connection);
                break;
            case 'message-read':
                handleMessageRead(message, connection);
                break;
            default:
                break;
        }
    });

    connection.on('close', () => {
        console.log("close called", wss.clients.size);
        notifyFriendsforCloseConnection(connection.userId);
    });
});

const notifyFriendsforCloseConnection = async (currentUserId) => {
    const foundUser = await UserModel.findOne({ _id: currentUserId });
    if(foundUser)
    {
        wss.clients.forEach((client) => {
            
            foundUser.friends.forEach((friend) => {
                const clientId = new mongoose.Types.ObjectId(client.userId);
                const friendId = new mongoose.Types.ObjectId(friend);
                if(clientId.equals(friendId)){
                    console.log("sending");
                    client.send(JSON.stringify({type: "notify-disconnection", data: currentUserId}));
                }
            });
        });
    }
}

const notifyFriendsforConnection = (onlineFriends, currentUserId) => {
    wss.clients.forEach((client) => {
        if(onlineFriends.find((friend) => {return client.userId == friend.userId.toString()})){
            client.send(JSON.stringify({type: "notify-connection", data: currentUserId}));
        }
    });
}

const findOnlineFriendsConversations = async (id, clients) => {
    try {
        const foundUser = await UserModel.findOne({ _id: id });
        if (!foundUser) return { online: [], offline: [] };

        // Get online friends
        const onlineFriends = Array.from(clients).reduce((acc, { username, userId }) => {
            if (foundUser.friends.includes(userId.toString())) {
                acc.push({ username, userId: new mongoose.Types.ObjectId(userId) });
            }
            return acc;
        }, []);
        notifyFriendsforConnection(onlineFriends, id);
        const onlinefriendIds = onlineFriends.map((friend) => friend.userId);

        // Fetch online conversations
        const convosOnline = await ConversationModel.find({
            $and: [
                { "participants.userId": foundUser._id }, // Found user is a participant
                { "participants.userId": { $in: onlinefriendIds } } // At least one online friend
            ]
        });

        // Fetch offline conversations
        const convosOffline = await ConversationModel.find({
            $and: [
                { "participants.userId": foundUser._id }, // Found user is a participant
                { "participants.userId": { $nin: onlinefriendIds } } // No online friends
            ]
        });

        let convosOnlineToReturn = [];
        let convosOfflineToReturn = [];

        // Map online conversations
        if (convosOnline.length > 0) {
            convosOnlineToReturn = await Promise.all(convosOnline.map(async (convo) => {
                let result = { convId: convo._id, participants: [], unreadMessages: 0};
                convo.participants.forEach((participant) => {
                    const participantToAdd = onlineFriends.find(
                        (friend) => participant.userId.equals(new mongoose.Types.ObjectId(friend.userId))
                    );
                    if (participantToAdd) {
                        result.participants.push(participantToAdd);
                    }
                });
                result.unreadMessages = await addUnreadMessageCountToConvo(foundUser._id, convo._id);
                return result;
            }));
        }

        // Map offline conversations
        if (convosOffline.length > 0) {
            const offlineFriends = await UserModel.find({
                _id: { $nin: onlinefriendIds }, // Not online
                _id: { $in: foundUser.friends } // Are friends
            });

            convosOfflineToReturn = await Promise.all(convosOffline.map(async (convo) => {
                let result = { convId: convo._id, participants: [] , unreadMessages: 0};
                convo.participants.forEach((participant) => {
                    const friendToAdd = offlineFriends.find(
                        (friend) => participant.userId.equals(friend._id)
                    );
                    if (friendToAdd) {
                        result.participants.push({ username: friendToAdd.username, userId: friendToAdd._id });
                    }
                });
                result.unreadMessages = await addUnreadMessageCountToConvo(foundUser._id, convo._id);
                return result;
            }));
        }

        return { online: convosOnlineToReturn, offline: convosOfflineToReturn };
    } catch (error) {
        console.error("Error finding online/offline conversations:", error);
        return { online: [], offline: [] };
    }
};

const addUnreadMessageCountToConvo = async (userObjId, convoObjId) => {
    const messages = await MessageModel.find({
        conversationId: convoObjId,
        status: {
            $elemMatch: {
                userId: userObjId,
                status: { $in: ["sent", "delivered"] }
            }
        }
    });
    if(messages) {
        for (var message of messages) {
            let objToModify = message.status.find((obj) => {return obj.userId.equals(userObjId)});
            objToModify.status = "delivered";
            await message.save();
        }
        return messages.length;
    }
    return 0;
}


const handleSearchUsername = async (msg, ws) => {
    const searchStr = msg.data;
    try {
        const results = await UserModel.find({
            username: { $regex: searchStr, $options: 'i' }});
        var searchResults = [];
        results.forEach((user) => {
            searchResults.push({userId: user._id, username: user.username, email: user.email});
        });
    
        ws.send(JSON.stringify({type: "search-results", data: searchResults}));
    } catch (error) {
        console.error(error);
        return;
    }
}

const handleAddFriend = async (msg, ws) => {
    try {
        var foundUserMe = await UserModel.findOne({_id: ws.userId});
        var foundUserOther = await UserModel.findOne({_id: msg.data.userId});
        if(foundUserMe && foundUserOther) {
            foundUserMe.friends.push(msg.data.userId);
            foundUserOther.friends.push(ws.userId);
            await foundUserMe.save();
            await foundUserOther.save();
            const conv = await ConversationModel.create({
                participants: [{userId: foundUserMe._id, role: "member"}, {userId: foundUserOther._id, role: "member"}],
                type: "direct",
            });
            const data = {convId: conv._id, friendId: foundUserOther._id, friendUsername: foundUserOther.username};
            ws.send(JSON.stringify({type: "new-conversation", data: data}));
        }
    } catch (error) {
        console.error(error);
    }  
}

const handleSendMessage = async (msg, ws) => {
    console.log("send message", msg);
    const convObjId = new mongoose.Types.ObjectId(msg.data.convId);
    const createdMessage = await MessageModel.create({conversationId: convObjId, senderId: new mongoose.Types.ObjectId(ws.userId), text: msg.data.text});
    //const senderObjId = new mongoose.Types.ObjectId(ws.userId);
    if(createdMessage) {
        const conv = await ConversationModel.findOne({_id: convObjId});
        
        for (const client of wss.clients) {
            const clientObjId = new mongoose.Types.ObjectId(client.userId);
            //sending the message also to the sender due to storing it in react state as it comes from the database. && (!participant.userId.equals(senderObjId))
            const foundClient = conv.participants.find((participant) => {return (participant.userId.equals(clientObjId) )});
            if(foundClient){
                console.log("sending");
                client.send(JSON.stringify({type: "recieve-message", data: createdMessage}));
                if(client.userId == ws.userId) {
                    createdMessage.status.push({userId: new mongoose.Types.ObjectId(client.userId), status: "read"});
                    await createdMessage.save();
                }else {
                    createdMessage.status.push({userId: new mongoose.Types.ObjectId(client.userId), status: "delivered"});
                    await createdMessage.save();
                }
            }
        }
        //find offline participants
        for (const participant of conv.participants) {
            const onlineParticipant = Array.from(wss.clients).find((client) => {return (participant.userId.equals(new mongoose.Types.ObjectId(client.userId)))});
            if(!onlineParticipant) {
                createdMessage.status.push({userId: new mongoose.Types.ObjectId(participant.userId), status: "sent"});
                await createdMessage.save();
            }
        }   
    }else {
        console.log("failed to create message");
    }
}

const handleRequestConversation = async (msg, ws) => {
    console.log("request conversation", msg);
    const convObjId = new mongoose.Types.ObjectId(msg.data.convId);
    const messages = await MessageModel.find({conversationId: convObjId});
    if(messages.length > 0) {
        ws.send(JSON.stringify({type: "full-conversation", data: {messages: messages}}));
    }else {
        ws.send(JSON.stringify({type: "full-conversation", data: {convId: convObjId.toString()}}));
    }
    await markMessagesAsRead(convObjId, new mongoose.Types.ObjectId(ws.userId));
}

const markMessagesAsRead = async (convObjId, userObjId) => {
    const messages = await MessageModel.find({
        conversationId: convObjId,
        status: {
            $elemMatch: {
                userId: userObjId,
                status: { $in: ["sent", "delivered"] }
            }
        }
    });
    if(messages) {
        for (var message of messages) {
            let objToModify = message.status.find((obj) => {return obj.userId.equals(userObjId)});
            objToModify.status = "read";
            await message.save();
        }
    }
}

const handleMessageRead = async (msg, ws) => {
    const message = await MessageModel.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(msg.data.msgId), 
        "status.userId": new mongoose.Types.ObjectId(ws.userId)
    }, {
        $set: { "status.$.status": "read" }
    }, {new: true});

    if(!message)
        throw new Error(`Couldn't update message with id : ${msg.data.msgId}`);
}


//3ss1ajwQMpDtJ9Os