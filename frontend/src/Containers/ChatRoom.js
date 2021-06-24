import "../App.css";
import { useState, useEffect } from "react";
import { Input, DatePicker, Space, Button, Table, Tag, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ChatModal from "../Components/ChatModal";
import useChatBox from "../hooks/useChatBox";
import useChat from "../hooks/useChat";
import "./ChatRoom.css";

const { Option } = Select;

const ChatRoom = ({ me, displayStatus }) => {
  // const [messageInput, setMessageInput] = useState("");
  // const [modalVisible, setModalVisible] = useState(false);
  // const [activeKey, setActiveKey] = useState("");
  // const [activeFriend, setActiveFriend] = useState("");
  // const { chatBoxes, createChatBox, removeChatBox } = useChatBox();
  // const { status, messages, startChat, sendMessage } = useChat();
  const [today, setToday] = useState(new Date().toISOString().slice(0, 10));
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("");
  const [money, setMoney] = useState(0);
  const [boxes, setBoxes] = useState([]);

  const onChange = (date, dateString) => {
    setToday(dateString);
    if (dateString === "") {
      setToday(today);
    }
  };
  const handleChange = (value) => {
    // console.log(value);
    setCategory(value);
  };
  const addToBox = () => {
    if (item === "") {
      displayStatus({
        type: "error",
        msg: "Please enter item.",
      });
      return;
    }
    const newboxes = boxes;
    if (newboxes.length === 0) {
      newboxes.push({ day: today, spending_item: [{ item, money, category }] });
    } else {
      for (let box in newboxes) {
        console.log(newboxes[box].day);
        console.log(today);
        if (newboxes[box].day === today) {
          newboxes[box].spending_item.push({ item, money, category });
        } else if (box === (newboxes.length - 1).toString() && newboxes[box] !== today) {
          newboxes.push({ day: today, spending_item: [{ item, money, category }] });
        }
      }
    }
    setBoxes(newboxes);
    setItem("");
    setMoney(0);
    console.table(boxes);
  };
  const columns = [
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      render: (item) => <p style={{ color: "#2db7f5" }}>{item}</p>,
    },
    {
      title: "Dollar",
      dataIndex: "dollar",
      key: "dollar",
      render: (dollar) => <p>{`$${dollar}`}</p>,
    },
    {
      title: "Dollar",
      dataIndex: "dollar",
      key: "dollar",
      render: (dollar) => <p>{`$${dollar}`}</p>,
    },

    {
      title: "Category",
      key: "category",
      dataIndex: "category",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = "green";
            if (tag === "Housing") color = "magenta";
            if (tag === "Transportation") color = "red";
            if (tag === "Food") color = "volcano";
            if (tag === "Utilities") color = "orange";
            if (tag === "Insurance") color = "gold";
            if (tag === "Medical") color = "lime";
            if (tag === "Saving, Investing, & Debt Payments") color = "green";
            if (tag === "Entertainment") color = "cyan";
            if (tag === "Miscellaneous") color = "purple";

            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      item: "candy",
      dollar: 10,
      category: ["Housing", "Food"],
    },
    {
      key: "2",
      item: "cake",
      dollar: 150,
      category: ["Entertainment"],
    },
    {
      key: "3",
      item: "meat",
      dollar: 70,
      category: ["Insurance", "Food"],
    },
  ];
  // console.table(data);
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
          style={{ width: "300px" }}
          placeholder="item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        ></Input>
        <Select style={{ width: "200px" }} defaultValue="Housing" onChange={handleChange}>
          <Option value="Housing">Housing</Option>
          <Option value="Transportation">Transportation</Option>
          <Option value="Food">Food</Option>
          <Option value="Utilities">Utilities</Option>
          <Option value="Insurance">Insurance</Option>
          <Option value="Medical">Medical</Option>
          <Option value="Investing">Saving, Investing, & Debt Payments</Option>
          <Option value="Entertainment">Entertainment</Option>
          <Option value="Miscellaneous">Miscellaneous</Option>
        </Select>
        <Input
          style={{ width: "100px" }}
          min={0}
          defaultValue={0}
          prefix="$"
          suffix="TWD"
          value={money}
          onChange={(e) => setMoney(e.target.value)}
        ></Input>
        <Button style={{ width: "100px" }} type="primary" icon={<PlusOutlined />} onClick={addToBox}>
          Add
        </Button>
      </div>
      <div className="App-textarea">
        <Table style={{ width: "700px" }} columns={columns} dataSource={data}></Table>
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
