import "../App.css";
import { Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined, EyeTwoTone, SearchOutlined } from "@ant-design/icons";
import { useRef } from "react";

const SignIn = ({ me, setMe, password, setPassword, setSignedIn, displayStatus }) => {
  const usernameInput = useRef();
  const focusUsername = () => usernameInput.current.focus();
  const passwordInput = useRef();
  const focusPassword = () => passwordInput.current.focus();

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
        placeholder="input password"
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
        icon={<SearchOutlined />}
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
          else setSignedIn(true);
        }}
        ref={passwordInput}
      >
        Sign In
      </Button>
    </>
  );
};

export default SignIn;
