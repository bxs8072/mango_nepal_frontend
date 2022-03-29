import { Tag, Modal, Input } from "antd";
import { execGetProfession } from "../api/apis";
import Loading from "../components/Loading";
import ModifiedButton from "../components/ModifiedButton";
import { PlusOutlined } from "@ant-design/icons";
import { proList } from "../utils/helpers";
import AddProfessional from "../modal/AddProfessional";
import LoginModal from "../modal/LoginModal";

export default function education({ user_data, login }) {
  const [showAddProfession, setShowAddProfession] = React.useState(false);
  const [state, setState] = React.useState({
    data: null,
    loading: false,
    error: false,
  });
  const [selectedTag, setSelectedTag] = React.useState(proList[0]);
  const [showLogin, setShowLogin] = React.useState(false);

  const fetchEducation = async (q = "") => {
    setState({ loading: true, data: null, error: false });
    try {
      const res = await execGetProfession(selectedTag, q);
      setState({ loading: false, data: res, error: false });
    } catch (err) {
      setState({ loading: false, error: err, data: null });
    }
  };

  React.useEffect(() => {
    fetchEducation();
  }, [selectedTag]);

  React.useEffect(() => {
    if (!user_data) {
      setShowLogin(true);
    }
  }, [user_data]);

  if (!user_data) {
    return (
      <div className="education">
        <LoginModal
          visible={showLogin}
          login={login}
          onCancel={(refresh = false) => {
            setShowLogin(false);
            if (refresh === true) {
              fetchEducation();
            }
          }}
        />
        <div className="wrap">
          <br />
          <div className="flex jcsb ci">
            <h2>Professional</h2>
          </div>
          <br />
          <p className="text red">You need to be logged in to view the content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="education">
      <AddProfessional visible={showAddProfession} onCancel={() => setShowAddProfession(false)} />
      <div className="wrap">
        <br />
        <div className="flex jcsb ci">
          <h2 className="flex ci">
            <img className="in-icon" src="/svg/pro.svg" alt="" />
            <p> Professional</p>
          </h2>
          <ModifiedButton onClick={() => setShowAddProfession(true)} text="Add Card" type="primary" icon={<PlusOutlined />} />
        </div>
        <br />
        <div className="res-search">
          <Input.Search
            placeholder={"Search Professionals"}
            onSearch={(val) => {
              fetchEducation(val);
            }}
            allowClear
            onChange={(e) => {
              if (!e.target.value) {
                fetchEducation();
              }
            }}
          ></Input.Search>
        </div>
        <br />
        {proList.map((item, index) => {
          return (
            <Tag color={selectedTag === item ? "blue" : "default"} key={index} style={{ cursor: "pointer" }} onClick={() => setSelectedTag(item)}>
              {item}
            </Tag>
          );
        })}
        <br />
        <br />
        {state.loading && <Loading />}
        {state.error && <p style={{ color: "red" }}>{state.error.message || "Unusual error occured, try again"}</p>}
        {/* {state.data} */}
        {state.data && state.data.length > 0 && (
          <div className="pro-wrapper">
            {state.data.map((item) => {
              return <ProfessionalCard key={item._id} {...item} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const ProfessionalCard = (props) => {
  const onDelete = () => {
    Modal.info({
      title: " ",
      icon: null,
      content: <ProcardInfo {...props} />,
      okButtonProps: { style: { background: "teal", borderColor: "teal" } },
    });
  };

  return (
    <div onClick={() => onDelete()} className="pro-card card">
      <div className="flex jcsb">
        <h3>
          {props.prefix}. {props.name}
        </h3>
        <p className="type-tag">{props.pro_type}</p>
      </div>
      <p>{props.specialized}</p>
      <p>
        Address: {props.city}, {props.state}, {props.zip}
      </p>
      <p>Hometown: {props.home_town || "n/a"}</p>
      <p>Contact: {props.contact || "n/a"}</p>
    </div>
  );
};

const ProcardInfo = (props) => {
  return (
    <div className="pro-card">
      <div className="flex jcsb">
        <h3>
          {props.prefix}. {props.name}
        </h3>
        <p className="type-tag">{props.pro_type}</p>
      </div>
      <p>{props.specialized}</p>
      <p>
        Address: {props.city}, {props.state}, {props.zip}
      </p>
      <p>Hometown: {props.home_town || "n/a"}</p>
      <p>Contact: {props.contact || "n/a"}</p>
      <p>Description: {props.description || "n/a"}</p>
    </div>
  );
};
