import "./App.css";
import { useState, useEffect } from "react";
import SignIn from "./Containers/SignIn";
import ChangePassword from "./Containers/ChangePassword";
import ChatRoom from "./Containers/ChatRoom";
import { message } from "antd";

const LOCALSTORAGE_KEY = "save-me";

const App = () => {
  const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);
  const [signedIn, setSignedIn] = useState(false);
  const [changepass, setChangepass] = useState(false);

  const [me, setMe] = useState(savedMe || "");
  const [password, setPassword] = useState("");
  const displayStatus = (payload) => {
    if (payload.msg) {
      const { type, msg } = payload;
      const content = {
        content: msg,
        duration: 1.5,
      };
      switch (type) {
        case "success":
          message.success(content);
          break;
        case "error":
        default:
          message.error(content);
          break;
      }
    }
  };

  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, me);
    }
  }, [signedIn]);

  // useEffect(() => {
  //   displayStatus(status)
  // }, [status])

  return (
    <div className="App">
      {signedIn && !changepass ? (
        <ChatRoom me={me} displayStatus={displayStatus} setSignedIn={setSignedIn} setChangepass={setChangepass} />
      ) : !signedIn && !changepass ? (
        <SignIn
          me={me}
          setMe={setMe}
          password={password}
          setPassword={setPassword}
          setSignedIn={setSignedIn}
          displayStatus={displayStatus}
        />
      ) : (
        <ChangePassword
          me={me}
          setMe={setMe}
          password={password}
          setPassword={setPassword}
          setSignedIn={setSignedIn}
          displayStatus={displayStatus}
          setChangepass={setChangepass}
        />
      )}
    </div>
  );
};
export default App;
