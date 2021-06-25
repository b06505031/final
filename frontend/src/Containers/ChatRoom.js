import "../App.css";
import { useState, useEffect } from "react";
import { Input, DatePicker, Space, Button, Table, Tag, Select } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
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
  const [category, setCategory] = useState("Housing");
  const [dollar, setDollar] = useState(0);
  const [boxes, setBoxes] = useState([]);

  const onChange = (date, dateString) => {
    setToday(dateString);
    if (dateString === "") {
      setToday(today);
    }
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
      newboxes.push({ day: today, spending_item: [{ item, dollar, category }] });
    } else {
      for (let box in newboxes) {
        if (newboxes[box].day === today) {
          newboxes[box].spending_item.push({ item, dollar, category });
          break;
        } else if (box === (newboxes.length - 1).toString() && newboxes[box] !== today) {
          newboxes.push({ day: today, spending_item: [{ item, dollar, category }] });
        }
      }
    }
    setBoxes(newboxes);
    setItem("");
    setDollar(0);
    // console.table(boxes);
  };
  const columns = [
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      render: (item) => <p style={{ color: "#2db7f5", fontSize: "20px", fontFamily: "Courgette,cursive" }}>{item}</p>,
    },
    {
      title: "Dollar",
      dataIndex: "dollar",
      key: "dollar",
      render: (dollar) => <p style={{ fontSize: "20px" }}>{`$${dollar}`}</p>,
    },
    {
      title: "Category",
      key: "category",
      dataIndex: "category",
      render: (tag) => {
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
          <Tag
            color={color}
            key={tag}
            style={{
              height: "30px",
              fontSize: "20px",
              borderRadius: "5px",
              lineHeight: "30px",
              fontFamily: "Concert One,cursive",
            }}
          >
            {tag.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space size="middle">
          <button className="item-delete" style={{ fontSize: "10px", borderColor: "transparent", borderRadius: "50%" }}>
            <CloseOutlined />
          </button>
        </Space>
      ),
    },
  ];
  // const data = [
  //   {
  //     key: "1",
  //     item: "candy",
  //     dollar: 10,
  //     category: ["Housing", "Food"],
  //   },
  //   {
  //     key: "2",
  //     item: "cake",
  //     dollar: 150,
  //     category: ["Entertainment"],
  //   },
  //   {
  //     key: "3",
  //     item: "meat",
  //     dollar: 70,
  //     category: ["Insurance", "Food"],
  //   },
  //   {
  //     key: "4",
  //     item: "egg",
  //     dollar: "8",
  //     category: ["Food"],
  //   },
  //   {
  //     key: "5",
  //     item: "mask",
  //     dollar: "100",
  //     category: ["Medical"],
  //   },
  // ];
  const dataToday = (boxes) => {
    let data = [];
    for (let i in boxes) {
      if (boxes[i].day === today) {
        for (let key in boxes[i]["spending_item"]) {
          boxes[i]["spending_item"][key]["key"] = Number(key) + 1;
        }
        data = boxes[i].spending_item;
      }
    }
    return data;
  };
  // console.log(data);
  // console.log(dataToday(boxes));
  useEffect(() => {}, [boxes]);
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
        <Select style={{ width: "200px" }} defaultValue="Housing" onChange={(value) => setCategory(value)}>
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
          value={dollar}
          onChange={(e) => setDollar(e.target.value)}
        ></Input>
        <Button style={{ width: "100px" }} type="primary" icon={<PlusOutlined />} onClick={addToBox}>
          Add
        </Button>
      </div>
      <div className="App-textarea">
        <Table style={{ width: "700px", margin: "10px" }} columns={columns} dataSource={dataToday(boxes)}></Table>
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
