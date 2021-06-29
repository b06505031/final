import { useState } from "react";

const client = new WebSocket("ws://localhost:4000");

const useTrack = (displayStatus) => {

  const [items, setItems] = useState([]);
  const [login, setLogin] = useState(false);
  const [change, setChange] = useState(false);

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
  const sendDeleteItem = (id) => {
    if (!id) {
    } else {
      client.sendEvent({
        type: "DELETE",
        data: { id: id },
      });
    }
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
  const sendChangepass = (name, password) => {
    if (!name || !password) {
      throw new Error("Empty input!");
    }

    client.sendEvent({
      type: "PASSCHANGE",
      data: { name: name, password: password },
    });
  };

  const onEvent = (e) => {
    const { type } = e;
    // console.log(e);

    switch (type) {
      case "OPEN": {

        console.log(e.data);
        setItems(e.data.datas);

        break;
      }
      case "UPLOAD": {
        console.log(e.data.datas);
        // setItems((oldItem) => [...oldItem, e.data.data]);
        setItems(e.data.datas);

        break;
      }
      case "PASSCHANGE": {
        setChange(e.data.change);
        break;
      }
      case "CHECK": {
        setLogin(e.data.login);
        if (e.data.login === false) {
          displayStatus({
            type: "error",
            msg: "Wrong password",
          });
        } else {
          displayStatus({
            type: "success",
            msg: "Login In !",
          });
        }
        // console.log(e.data.login)
        break;
      }
      default:
        break;
    }
  };

  return { items, login, change, startDate, sendItem, sendUser, sendDeleteItem, sendChangepass };
};

export default useTrack;
