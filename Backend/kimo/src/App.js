import React from "react";
import Auth from "./components/auth";
import { useState } from "react";
import Main from "./components/main";

function App() {
  const [authStatus, setAuthStatus] = useState(false);
  const [username, setUsername] = useState("");
  const [start,setStart] = useState(false)
  return (
    <>
      {authStatus ? (
        <Main start = {start} setStart={setStart} username={username}></Main>
      ) : (
        <Auth
          setAuthStatus={setAuthStatus}
          authStatus={authStatus}
          username={username}
          setUsername={setUsername}
        />
      )}
    </>
  );
}

export default App;
