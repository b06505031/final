import mongoose from 'mongoose';
import http from 'http';
import WebSocket from 'ws';
import express from 'express';
import path from 'path';
import { v4 } from 'uuid';
import dotenv from 'dotenv-defaults';
import mongo from './mongo';

const app = express();
dotenv.config();

/* -------------------------------------------------------------------------- */
/*                               MONGOOSE MODELS                              */
/* -------------------------------------------------------------------------- */
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String},
  password:{type: String},
  dateBoxes: [{ type: mongoose.Types.ObjectId, ref: 'DateBox' }],
});

const dataSchema = new Schema({
  dateBox: { type: mongoose.Types.ObjectId, ref: 'DateBox' },
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  item: { type: String, required: true },
  category: { type: String, required: true },
  dollar: { type: String, required: true },
});

const dateBoxSchema = new Schema({
  name: { type: String, required: true },
  user: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  datas: [{ type: mongoose.Types.ObjectId, ref: 'Data' }],
});

const UserModel = mongoose.model('User', userSchema);
const DateBoxModel = mongoose.model('DateBox', dateBoxSchema);
const DataModel = mongoose.model('Data', dataSchema);

/* -------------------------------------------------------------------------- */
/*                                  UTILITIES                                 */
/* -------------------------------------------------------------------------- */
const makeName = (name, date) => {
  return [name, date].sort().join('_');
};

/* -------------------------------------------------------------------------- */
/*                            SERVER INITIALIZATION                           */
/* -------------------------------------------------------------------------- */
const server = http.createServer(app);

const wss = new WebSocket.Server({
  server,
});

// app.use(express.static(path.join(__dirname, 'public')));

const validateUser = async (name) => {
  const existing = await UserModel.findOne({ name });
  if (existing) return existing;
  return new UserModel({ name }).save();
};

// const validateChatBox = async (name, participants) => {
//   let box = await ChatBoxModel.findOne({ name });
//   if (!box) box = await new ChatBoxModel({ name, users: participants }).save();
//   return box
//     .populate('users')
//     .populate({ path: 'messages', populate: 'sender' })
//     .execPopulate();
// };

const validateDateBox = async (name,user) => {

  let box = await DateBoxModel.findOne({ name });
  if (!box) box = await new DateBoxModel({ name ,user}).save();
  return box
    .populate('user')
    .populate({ path: 'datas', populate: 'user' })
    .execPopulate();
};

// (async () => {
//   const a = await validateUser('a');
//   const b = await validateUser('b');

//   console.log(a);

//   const cbName = makeName('a', 'b');

//   const chatBox = await validateChatBox(cbName, [a, b]);

//   console.log(chatBox);
// })();

const chatBoxes = {}; // keep track of all open AND active chat boxes
const dateBoxes ={}
wss.on('connection', function connection(client) {
  client.id = v4();
  client.box = ''; // keep track of client's CURRENT chat box

  client.sendEvent = (e) => client.send(JSON.stringify(e));
  
  client.on('message', async function incoming(message) {
    message = JSON.parse(message);
    // console.log(message);
    const { type } = message;

    switch (type) {
      // on open chat box
      case 'OPEN':{
        const {
          data: { name, date },
        } = message;
        
        const dateBoxName = makeName(name, date);
        const user = await validateUser(name);
        const dateBox =await validateDateBox(dateBoxName, user);
        if (dateBoxes[client.box]){
          // user was in another chat box
          dateBoxes[client.box].delete(client);
        }
        client.box = dateBoxName;
        if (!dateBoxes[dateBoxName]) dateBoxes[dateBoxName] = new Set(); // make new record for chatbox
        dateBoxes[dateBoxName].add(client);
        console.log(dateBox.length)
          
        console.log("----------------------------------------------------")
        client.sendEvent({
          type: 'OPEN',
          data: {
            datas: dateBox.datas.map(({ user: { name }, item,category,dollar }) => ({
              name,
              // DataModel.findById
              item,
              category,
              dollar,
              dateBoxName,
            })),
          },
        });

        break;
      }
      // case 'CHAT': {
      //   const {
      //     data: { name, to },
      //   } = message;

      //   const chatBoxName = makeName(name, to);

      //   const sender = await validateUser(name);
      //   const receiver = await validateUser(to);
      //   const chatBox = await validateChatBox(chatBoxName, [sender, receiver]);

      //   // if client was in a chat box, remove that.
      //   if (chatBoxes[client.box]){
      //     // user was in another chat box
      //     chatBoxes[client.box].delete(client);
      //   }

      //   // use set to avoid duplicates
      //   client.box = chatBoxName;
      //   if (!chatBoxes[chatBoxName]) chatBoxes[chatBoxName] = new Set(); // make new record for chatbox
      //   chatBoxes[chatBoxName].add(client); // add this open connection into chat box

      //   client.sendEvent({
      //     type: 'CHAT',
      //     data: {
      //       messages: chatBox.messages.map(({ sender: { name }, body }) => ({
      //         name,
      //         body,
      //         chatBoxName,
      //       })),
      //     },
      //   });

      //   break;
      // }
      case 'UPLOAD':{
        const {
          data: { name, date, item,category,dollar },
        } = message;
        const dateBoxName = makeName(name, date);

        const user = await validateUser(name);
        const dateBox = await validateDateBox(dateBoxName, user);
        const newItem = new DataModel({ user, item:item,category:category,dollar:dollar });
        await newItem.save();
        dateBox.datas.push(newItem);
        await dateBox.save();
        console.log(item)
        dateBoxes[dateBoxName].forEach((client) => {
          // console.log(client);
          client.sendEvent({
            type: 'UPLOAD',
            data: {
              data: {
                name,
                item,
                category,
                dollar,
                dateBoxName
              },
            },
          });
        });
      }
      // case 'MESSAGE': {
      //   const {
      //     data: { name, to, body },
      //   } = message;
      //   // console.log("get message");

      //   const chatBoxName = makeName(name, to);

      //   const sender = await validateUser(name);
      //   const receiver = await validateUser(to);
      //   const chatBox = await validateChatBox(chatBoxName, [sender, receiver]);

      //   const newMessage = new MessageModel({ sender, body });
      //   await newMessage.save();

      //   chatBox.messages.push(newMessage);
      //   await chatBox.save();

      //   chatBoxes[chatBoxName].forEach((client) => {
      //     // console.log("send message");
      //     client.sendEvent({
      //       type: 'MESSAGE',
      //       data: {
      //         message: {
      //           name,
      //           body,
      //           chatBoxName
      //         },
      //       },
      //     });
      //   });
      // }
      case 'CHECK':{
        const {
          data: { name, password },
        } = message;
        const existuser=await UserModel.findOne({name})
        if(!existuser){
          const user =new UserModel({name:name,password:password});
          await user.save();
          client.sendEvent({
            type: 'CHECK',
            data: {
              login:true
              }
          });
        }else{
          if(existuser.password!==password){
            // console.log("password ERROR")
            client.sendEvent({
              type: 'CHECK',
              data: {
                login:false
                }
            });
          }
          else if(existuser.password===password){
            client.sendEvent({
              type: 'CHECK',
              data: {
                login:true
                }
            });
          }
        }
      }
    }

    // disconnected
    client.once('close', () => {
      dateBoxes[client.box].delete(client);
    });
  });
});

mongo.connect();

server.listen(4000, () => {
  console.log('Server listening at http://localhost:4000');
});
