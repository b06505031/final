import "../App.css";
import { Input, Button } from "antd";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined } from "@ant-design/icons";
import { useRef, useEffect } from "react";
import useTrack from "../hooks/useTrack";

const ChangePassword = ({ me, setMe, password, setPassword,  displayStatus,setChangepass }) => {
  const usernameInput = useRef();
  const focusUsername = () => usernameInput.current.focus();
  const passwordInput = useRef();
  const focusPassword = () => passwordInput.current.focus();
  const { change,sendChangepass } = useTrack(displayStatus);
  useEffect(() => {
    if (change) {
      setChangepass(false);
      
    }
  }, [change]);
  return (
    <>
      <div className="App-title">
        <h1>Track Spending</h1>
      </div>
      <Input
        prefix={<UserOutlined />}
        value={me}
        onChange={(e) => setMe(e.target.value)}
        placeholder="Enter your name"
        size="large"
        style={{ width: 300, margin: 10 }}
        onKeyDown={(e) => {
          if (e.key === "Enter") focusUsername();
        }}
      ></Input>
      <Input.Password
        placeholder="password"
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        size="large"
        style={{ width: 300 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        ref={usernameInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") focusPassword();
        }}
      ></Input.Password>
      <Button
        type="primary"
        icon={<CheckCircleOutlined />}
        style={{ width: 300, margin: 10 }}
        onClick={() => {
          if (!me)
            displayStatus({
              type: "error",
              msg: "Missing user name",
            });
          else if (!password)
            displayStatus({
              type: "error",
              msg: "Missing user password",
            });
          else {
            sendChangepass(me, password);
            setChangepass(false)
          }
        }}
        ref={passwordInput}
      >
        ChangePassword
      </Button>
    </>
  );
};

export default ChangePassword;
