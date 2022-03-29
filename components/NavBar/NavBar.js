import React from "react";
import "./style.scss";
import Link from "next/link";
import { Avatar } from "antd";
import { useRouter } from "next/router";
import { MenuOutlined, BookOutlined, HomeOutlined, PaperClipOutlined, GoldOutlined } from "@ant-design/icons";

const navItems = [
  { text: "Home", goto: "/", image: "/svg/home.svg" },
  { text: "Blogs", goto: "/blogs", image: "/svg/book-open.svg" },
  { text: "Statistics", goto: "/statistics", image: "/svg/statistics.svg" },
  { text: "Mentorship", goto: "/mentoring", image: "/svg/mentorship.svg" },
  // { text: "Tutoring", goto: "/tutoring", image: "/svg/tutor.svg" },
  { text: "Professionals", goto: "/professional", image: "/svg/pro.svg" },
  { text: "Organizations", goto: "/organization", image: "/svg/org.svg" },
  { text: "Resources", goto: "/resources", icon: <PaperClipOutlined /> },
];

export default function NavBar({ user_data, logout }) {
  const getFirstLetterName = () => {
    return user_data ? user_data.name.substr(0, 1) : false;
  };

  return (
    <nav>
      <div className="wrap">
        <div className="flex jcsb ci">
          <aside className="left">
            {/* <h1 className="brand-title">DataCamp</h1> */}
            <Link href="/">
              <a>
                <img src="/logo.png" alt="" width="100px" />
              </a>
            </Link>
          </aside>
          <aside className="right flex ci">
            <div className="hide-on-mob">
              {navItems.map((item, index) => (
                <Link key={index} href={item.goto}>
                  <span className="link-span">
                    {item.image && <img src={item.image} alt="" />}
                    {item.icon && item.icon}
                    <a>{item.text}</a>
                  </span>
                </Link>
              ))}
            </div>

            <MobSideBar />

            {user_data && <AuthDropDown logout={logout} image={user_data.image} letter={getFirstLetterName()} />}
            {!user_data && (
              <React.Fragment>
                <button className="sign-in-btn">
                  <Link href="/login">
                    <a>Sign In</a>
                  </Link>
                </button>

                <button className="sign-in-btn outline hide-on-mob">
                  <Link href="/register">
                    <a>Register</a>
                  </Link>
                </button>
              </React.Fragment>
            )}
          </aside>
        </div>
      </div>
    </nav>
  );
}

const MobSideBar = () => {
  const [expand, setExpand] = React.useState(false);

  return (
    <div className="sidebar-mobile show-on-mob">
      <span className="toggler" style={{ padding: 3, cursor: "pointer" }} onClick={() => setExpand(!expand)}>
        <MenuOutlined style={{ color: "#000" }} />
      </span>
      {expand && (
        <React.Fragment>
          <div className="overlay" onClick={() => setExpand(false)}></div>
          <div className="drop-list">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} onClick={() => setExpand(false)}>
                  <Link href={item.goto}>
                    <span className="link-span mob flex ci">
                      {item.image && <img src={item.image} alt="" />}
                      {item.icon && item.icon}
                      <a>{item.text}</a>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const AuthDropDown = ({ image, logout, letter }) => {
  const router = useRouter();
  const [showDD, setShowDD] = React.useState(false);

  return (
    <div className="auth-drop-down">
      {image && <img className="logged-in-image" onClick={() => setShowDD(true)} src={image} alt="" />}
      {!image && (
        <Avatar onClick={() => setShowDD(true)} style={{ background: "red", cursor: "pointer", fontWeight: 700 }}>
          <p style={{ fontSize: 16 }}>{letter}</p>
        </Avatar>
      )}
      {showDD && (
        <React.Fragment>
          <div className="dd-wrapper" onClick={() => setShowDD(false)}></div>
          <div className="dropdown">
            <ul>
              <li
                onClick={() => {
                  router.push("/profile");
                  setShowDD(false);
                }}
              >
                Profile
              </li>
              <li
                onClick={() => {
                  router.push("/conversation");
                }}
              >
                Messages
              </li>
              <li
                onClick={() => {
                  router.push("/my_blog");
                  setShowDD(false);
                }}
              >
                My Blogs
              </li>
              <li
                onClick={() => {
                  router.push("/write_blog");
                  setShowDD(false);
                }}
              >
                Write Blog
              </li>
              <li
                onClick={() => {
                  logout();
                  setShowDD(false);
                }}
              >
                Log Out
              </li>
            </ul>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
