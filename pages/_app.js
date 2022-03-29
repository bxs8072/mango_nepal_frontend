import React from "react";
import "../css/index.scss";
import NavBar from "../components/NavBar";
import Head from "next/head";
import Footer from "../components/Footer/Footer";
import { useRouter } from "next/router";
import { ENDPOINT } from "../api/socket";
import io from "socket.io-client";
import { notifySuccess, notifyError } from "../utils/notification";


function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [userInfo, setUserInfo] = React.useState({
    token: false,
    user_data: null,
  });

  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("token")
    if (token && !socket) {
      const newSocket = io(ENDPOINT, {
        query: { token },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        notifyError("error", "Socket Disconnected!");
      });

      newSocket.on("connect", () => {
        notifySuccess("success", "Socket Connected!");
      });

      setSocket(newSocket);
    }
  };

  React.useEffect(() => {
    setupSocket();
  }, []);


  React.useEffect(() => {
    const login_token = localStorage.getItem("token") || false;
    const user_data = localStorage.getItem("data") || false;

    if (login_token && user_data) {
      setUserInfo({ token: login_token, user_data: JSON.parse(user_data) });
    }
  }, []);

  const login = (token, user_data) => {
    setUserInfo({
      token,
      user_data,
    });
    localStorage.setItem("token", token);
    localStorage.setItem("data", JSON.stringify(user_data));
  };

  const logout = () => {
    setUserInfo({
      token: false,
      user_data: null,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    router.push("/");
  };

  return (
    <React.Fragment>
      <Head>
        <title>MangoNepal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar logout={logout} user_data={userInfo.user_data} />
      <div className="dynamic-data" style={{ minHeight: "calc(100vh - 200px)" }}>
        <Component login={login} token={userInfo.token} logout={logout} user_data={userInfo.user_data} socket={socket} {...pageProps} />
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default MyApp;
