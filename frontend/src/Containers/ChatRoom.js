import "../App.css";
import { useState, useEffect } from "react";
import { Tabs, Input, DatePicker, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ChatModal from "../Components/ChatModal";
import useChatBox from "../hooks/useChatBox";
import useChat from "../hooks/useChat";
import "./ChatRoom.css";

const ChatRoom = ({ me, displayStatus }) => {
  // const [messageInput, setMessageInput] = useState("");
  // const [modalVisible, setModalVisible] = useState(false);
  // const [activeKey, setActiveKey] = useState("");
  // const [activeFriend, setActiveFriend] = useState("");
  // const { chatBoxes, createChatBox, removeChatBox } = useChatBox();
  // const { status, messages, startChat, sendMessage } = useChat();
  const [today, setToday] = useState(new Date().toISOString().slice(0, 10));
  const [item, setItem] = useState("");
  const [money, setMoney] = useState(0);
  const [boxes, setBoxes] = useState([]);
  const onChange = (date, dateString) => {
    setToday(dateString);
    if (dateString === "") {
      setToday(today);
    }
  };
  // const addChatBox = () => {
  //   setModalVisible(true);
  // };

  // useEffect(() => {
  //   updateName(activeKey);
  // }, [activeKey]);

  // const updateName = (activeKey) => {
  //   chatBoxes.map(({ friend, key, chatLog }) => {
  //     if (activeKey === key) {
  //       setActiveFriend(friend);
  //       startChat(friend, me);
  //     }
  //   });
  // };

  return (
    <>
      <div className="App-title">
        <Space direction="horizontal">
          <h1>{today}</h1>
          <DatePicker onChange={onChange} />
        </Space>
      </div>
      <div className="App-input">
        <Input
          style={{ width: "500px" }}
          placeholder="item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        ></Input>
        <Input
          style={{ width: "100px" }}
          min={0}
          defaultValue={0}
          prefix="$"
          suffix="TWD"
          value={money}
          onChange={(e) => setMoney(e.target.value)}
        ></Input>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            if (item === "") {
              displayStatus({
                type: "error",
                msg: "Please enter item.",
              });
              return;
            }
            const newboxes = boxes;
            for (let box in newboxes) {
              if (newboxes[box].day === today) {
                newboxes[box].spending_item.push({ item, money });
              } else if (box === (newboxes.length - 1).toString()) {
                newboxes.push({ day: today, spending_item: [{ item, money }] });
              }
            }
            if (newboxes.length === 0) {
              newboxes.push({ day: today, spending_item: [{ item, money }] });
            }
            setBoxes(newboxes);
            setItem("");
            setMoney(0);
            console.log(boxes);
          }}
        >
          Add
        </Button>
      </div>

      {/* <div className="App-messages">
        <Tabs
          type="editable-card"
          activeKey={activeKey}
          onEdit={(targetKey, action) => {
            if (action === "add") addChatBox();
            else if (action === "remove") setActiveKey(removeChatBox(targetKey, activeKey));
          }}
          onChange={(key) => {
            setActiveKey(key);
          }}
        >
          {chatBoxes.map(({ friend, key, chatLog }) => {
            return (
              <TabPane tab={friend} key={key} closable={true}>
                {messages.map(({ name, body, chatBoxName }) => {
                  if (chatBoxName === key) {
                    if (name !== me) {
                      return (
                        <p className="time-left">
                          <span className="sender">{name}</span> <span className="message-box">{body}</span>
                        </p>
                      );
                    } else {
                      return (
                        <p className="time-right">
                          <span className="message-box">{body}</span> <span className="sender">{name}</span>
                        </p>
                      );
                    }
                  }
                })}
              </TabPane>
            );
          })}
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
        style={{ width: "500px" }}
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        enterButton="Send"
        placeholder="Enter message here..."
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
      ></Input.Search> */}
    </>
  );
};

export default ChatRoom;
