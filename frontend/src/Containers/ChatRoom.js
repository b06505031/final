import "../App.css";
import { useState, useEffect } from "react";
import { Tabs, Input } from "antd";
import ChatModal from "../Components/ChatModal";
import useChatBox from "../hooks/useChatBox";
import useChat from "../hooks/useChat";
import "./ChatRoom.css";

const { TabPane } = Tabs;
const ChatRoom = ({ me, displayStatus }) => {
  const [messageInput, setMessageInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [activeKey, setActiveKey] = useState("")
  const [activeFriend, setActiveFriend] = useState("")
  const { chatBoxes, createChatBox, removeChatBox } = useChatBox();
  const { status, messages, startChat, sendMessage } = useChat();

  const addChatBox = () => { setModalVisible(true); };

  useEffect(() => {
    updateName(activeKey)
  }, [activeKey])

  const updateName = (activeKey) => {
    chatBoxes.map(({ friend, key, chatLog }) => {
      if(activeKey === key){
        setActiveFriend(friend);
        startChat(friend, me);
      }
    })
  }

  return (
    <> <div className="App-title">
         <h1>{me}'s Chat Room</h1> </div>
      <div className="App-messages">
        <Tabs type="editable-card" activeKey={activeKey} onEdit={(targetKey, action) => {
            if (action === "add") addChatBox()
            else if (action === "remove") setActiveKey(removeChatBox(targetKey, activeKey));;}}
             onChange={(key) => { setActiveKey(key) }}>
          {chatBoxes.map((
            { friend, key, chatLog }) => {
              return (
                 <TabPane tab={friend}
                   key={key} closable={true}>
                   {messages.map(({name, body, chatBoxName}) => {
                     if(chatBoxName === key){
                       if(name !== me){
                         return (
                           <p className="time-left"><span className="sender">{name}</span> <span className="message-box">{body}</span></p>
                         )
                       } else {
                         return (
                           <p className="time-right"><span className="message-box">{body}</span> <span className="sender">{name}</span></p>
                         )
                       }
                     }
                   })}
                 </TabPane>
              );})}
        </Tabs>
        <ChatModal
          visible={modalVisible}
          onCreate={({ name }) => {
            setActiveKey(createChatBox(name, me));
            setModalVisible(false);
          }}
          onCancel={() => {
            setModalVisible(false);
          }}
        />
      </div>
      <Input.Search
        value={messageInput}
        onChange={(e) =>
          setMessageInput(e.target.value)}
        enterButton="Send"
        placeholder=
          "Enter message here..."
        onSearch={(msg) => {
          if (!msg) {
             displayStatus({
               type: "error",
               msg: "Please enter message.",
             });
             return;
           } else if (activeKey === "") {
             displayStatus({
               type: "error",
               msg: "Please add a chatbox first.",
             });
             setMessageInput("");
             return;
           }
           // sendMessage({ key: activeFriend, body: msg });
           sendMessage(me, activeFriend, msg);
           setMessageInput("");
         }}
       ></Input.Search>
    </>);
};

export default ChatRoom;
