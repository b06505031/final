import { useState } from "react";

const client = new WebSocket("ws://localhost:4000");

const useChat = (displayStatus) => {
  const [status, setStatus] = useState({}); // { type, msg }
  const [items, setItems] = useState([]);
  const [login, setLogin] = useState(false);
  const waitForOpenSocket = () => {
    return new Promise((resolve, reject) => {
      const maxNumberOfAttempts = 10;
      const intervalTime = 200; //ms

      let currentAttempt = 0;
      const interval = setInterval(() => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          clearInterval(interval);
          reject(new Error("Maximum number of attempts exceeded"));
        } else if (client.readyState === client.OPEN) {
          clearInterval(interval);
          resolve();
        }
        currentAttempt++;
      }, intervalTime);
    });
  };

  client.onopen = () => {
    console.log("Server connected.");
  };

  client.onmessage = (m) => {
    onEvent(JSON.parse(m.data));
  };

  client.sendEvent = async (m) => {
    await waitForOpenSocket();
    client.send(JSON.stringify(m));
  };

  const startDate = (name, date) => {
    if (!name || !date) {
      throw new Error("Fill in the inputs");
    }

    client.sendEvent({
      type: "OPEN",
      data: { name: name, date: date },
    });
    // console.log(name,date)
  };

  const sendItem = (name, date, item, category, dollar) => {
    if (!name || !date || !item || !category) {
      throw new Error("Empty input!");
    }

    client.sendEvent({
      type: "UPLOAD",
      data: { name: name, date: date, item: item, category: category, dollar: dollar },
    });
  };
  const sendUser = (name, password) => {
    if (!name || !password) {
      throw new Error("Empty input!");
    }

    client.sendEvent({
      type: "CHECK",
      data: { name: name, password: password },
    });
  };

  const onEvent = (e) => {
    const { type } = e;
    // console.log(e);

    switch (type) {
      case "OPEN": {
        // console.log(e.data.messages);
        console.log(e.data);
        setItems(e.data.datas);
        // setMessages(e.data.messages);
        break;
      }
      case "UPLOAD": {
        console.log(e.data.data);
        setItems((oldItem) => [...oldItem, e.data.data]);
        break;
      }
      case "CHAT": {
        // console.log(e.data.messages);
        // setMessages(e.data.messages);
        break;
      }
      case "MESSAGE": {
        // console.log(e.data.message);
        // setMessages(oldMessage => [...oldMessage, e.data.message]);
        break;
      }
      case "CHECK": {
        if (e.data.login === false) {
          displayStatus({
            type: "error",
            msg: "Wrong password",
          });
        }
        setLogin(e.data.login);
        // console.log(e.data.login);
        break;
      }
      default:
        break;
    }
  };

  return { status, items, login, startDate, sendItem, sendUser };
};

export default useChat;
