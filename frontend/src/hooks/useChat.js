import { useState } from "react";

const client = new WebSocket('ws://localhost:4000');

const useChat = () => {
  const [status, setStatus] = useState({}); // { type, msg }
  const [messages, setMessages] = useState([]);
  const [login,setLogin] =useState(false)
  const waitForOpenSocket = () => {
        return new Promise((resolve, reject) => {
            const maxNumberOfAttempts = 10
            const intervalTime = 200 //ms

            let currentAttempt = 0
            const interval = setInterval(() => {
                if (currentAttempt > maxNumberOfAttempts - 1) {
                    clearInterval(interval)
                    reject(new Error('Maximum number of attempts exceeded'))
                } else if (client.readyState === client.OPEN) {
                    clearInterval(interval)
                    resolve()
                }
                currentAttempt++
            }, intervalTime)
        })
    }

  client.onopen = () => {
    console.log('Server connected.');
  };

  client.onmessage = (m) => {
    onEvent(JSON.parse(m.data));
  };

  client.sendEvent = async (m) => {
        await waitForOpenSocket()
        client.send(JSON.stringify(m))
  }

  const startChat = (name, to) => {
    if (!name || !to) {
      throw new Error('Fill in the inputs');
    }

    client.sendEvent({
      type: 'CHAT',
      data: { to: to, name: name },
    });
  };

  const sendMessage = (name, to, input) => {
    if (!input || !name || !to) {
      throw new Error('Empty input!');
    }

    client.sendEvent({
      type: 'MESSAGE',
      data: { to: to, name: name, body: input },
    });
  };
  const sendUser = (name, password) => {
    if (!name || !password) {
      throw new Error('Empty input!');
    }

    client.sendEvent({
      type: 'CHECK',
      data: { name: name, password: password},
    });
  };

  const onEvent = (e) => {
    const { type } = e;
    // console.log(e);

    switch (type) {
      case 'CHAT': {
        // console.log(e.data.messages);
        setMessages(e.data.messages);
        break;
      }
      case 'MESSAGE': {
        // console.log(e.data.message);
        setMessages(oldMessage => [...oldMessage, e.data.message]);
        break;
      }
      case 'CHECK':{
        setLogin(e.data.login);
        // console.log(e.data.login)
        break;
      }
      default: break;
    }
  };

  return { status, messages,login, startChat, sendMessage ,sendUser};
};

export default useChat;
