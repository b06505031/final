import "../App.css";
import { useState, useEffect } from "react";
import { Input, DatePicker, Space, Button, Table, Tag, Select, Descriptions, Menu } from "antd";
import { PlusOutlined, CloseOutlined, SettingOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
// import ChatModal from "../Components/ChatModal";
// import useChatBox from "../hooks/useChatBox";
import useChat from "../hooks/useChat";
import "./ChatRoom.css";

const { Option } = Select;
const { SubMenu } = Menu;

const ChatRoom = ({ me, displayStatus, setSignedIn }) => {
  const [today, setToday] = useState(new Date().toISOString().slice(0, 10));
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("Housing");
  const [dollar, setDollar] = useState(0);
  const [boxes, setBoxes] = useState([]);
  const { items, startDate, sendItem,sendDeleteItem } = useChat(displayStatus);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) {
      startDate(me, today);
      setOpen(true);
    }
  }, [open]);
  const onChange = (date, dateString) => {
    setToday(dateString);
    if (dateString === "") {
      setToday(today);
    }
    startDate(me, dateString);
  };

  // console.log(items)
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
    sendItem(me, today, item, category, dollar);
    console.log(items);
    setBoxes(newboxes);
    setItem("");
    setDollar(0);
    // console.table(boxes);
  };

  const calTotalCost = (boxes) => {
    let total = 0;
    // for (let i in boxes) {
    //   if (boxes[i].day === today) {
    //     for (let key in boxes[i]["spending_item"]) {
    //       total += Number(boxes[i]["spending_item"][key].dollar);
    //     }
    //   }
    // }
    for (let i in boxes){
      // console.log(boxes[i])
      total += Number(boxes[i].dollar);
    }
    return total;
  };
  const deleteItem = (e)=>{
    console.log(e.target.id)
    sendDeleteItem(e.target.id)
    startDate(me, today);
  }
  const columns = [
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      width: "30%",
      render: (item) => <p style={{ color: "#2db7f5", fontSize: "20px", fontFamily: "Courgette,cursive" }}>{item}</p>,
    },
    {
      title: "Dollar",
      dataIndex: "dollar",
      key: "dollar",
      width: "20%",
      render: (dollar) => <p style={{ fontSize: "20px" }}>{`$${dollar}`}</p>,
    },
    {
      title: "Category",
      key: "category",
      dataIndex: "category",
      width: "35%",
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
      title: "Delete",
      key: "delete",
      render: (key) => (
        <Space size="middle"  id={key.key}  onClick={deleteItem}>
          <button className="item-delete" id={key.key} style={{ fontSize: "10px", borderColor: "transparent", borderRadius: "50%" }}>
          <svg id={key.key} viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path id={key.key} d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
          </button>
        </Space>
      ),
    },
  ];

  const dataToday = (boxes) => {
    let data = [];
    for (let i in boxes) {
      if (boxes[i].day === today) {
        for (let key in boxes[i]["spending_item"]) {
          boxes[i]["spending_item"][key]["key"] = Number(key) + 1;
        }
        data = [...boxes[i].spending_item];
      }
    }
    return data;
  };
  // console.log(dataToday(boxes));
  // console.log(items)
  return (
    <>
      <div className="App-header">
        <h1>{me}</h1>
        <Menu
          style={{ width: 150, fontWeight: "600" }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="horizontal"
        >
          <SubMenu key="sub4" title="Menu" icon={<MenuOutlined />}>
            <Menu.Item key="1" icon={<SettingOutlined />}>
              Change password
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<LogoutOutlined />}
              onClick={() => {
                setSignedIn(false);
              }}
            >
              Logout
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
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
          <Option value="Investing">Saving, Investing,  Debt Payments</Option>
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
        <Table
          // bordered
          style={{ width: "700px", margin: "10px", height: "300px" }}
          columns={columns}
          dataSource={items}
          pagination={{ pageSize: 5 }}
          scroll={{ y: 252 }}
        ></Table>
      </div>
      <div className="App-total_cost">
        <Descriptions bordered>
          <Descriptions.Item
            label="Total Spend"
            labelStyle={{ background: "#d9d9d9", fontWeight: "bolder" }}
            contentStyle={{ fontSize: "15px", fontWeight: "bolder" }}
          >{`${calTotalCost(items)}  TWD`}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  );
};

export default ChatRoom;
