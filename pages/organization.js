import { Tag, Modal, Input } from "antd";
import { execGetBusiness } from "../api/apis";
import Loading from "../components/Loading";
import ModifiedButton from "../components/ModifiedButton";
import { PlusOutlined } from "@ant-design/icons";
import { businessList } from "../utils/helpers";
import AddBusiness from "../modal/AddBusiness";

export default function business({ token }) {
  const [showAddProfession, setShowAddProfession] = React.useState(false);
  const [state, setState] = React.useState({
    data: null,
    loading: false,
    error: false,
  });
  const [selectedTag, setSelectedTag] = React.useState("All");

  const fetchEducation = async (q = "") => {
    setState({ loading: true, data: null, error: false });
    try {
      const res = await execGetBusiness(selectedTag, q);
      setState({ loading: false, data: res, error: false });
    } catch (err) {
      setState({ loading: false, error: err, data: null });
    }
  };

  React.useEffect(() => {
    fetchEducation();
  }, [selectedTag]);

  return (
    <div className="education">
      <AddBusiness token={token} visible={showAddProfession} onCancel={() => setShowAddProfession(false)} />
      <div className="wrap">
        <br />
        <div className="flex jcsb ci">
          <h2 className="flex ci">
            <img className="in-icon" src="/svg/org.svg" alt="" />
            <p> Organizations</p>
          </h2>
          <ModifiedButton onClick={() => setShowAddProfession(true)} text="Add Organization" type="primary" icon={<PlusOutlined />} />
        </div>
        <br />
        <div className="res-search">
          <Input.Search
            placeholder="Search Organizations"
            onSearch={(val) => {
              fetchEducation(val);
            }}
            allowClear
            onChange={(val) => {
              const txt = val.target.value;
              if (!txt) {
                fetchEducation();
              }
            }}
          ></Input.Search>
        </div>
        <br />
        <Tag color={selectedTag === "All" ? "blue" : "default"} style={{ cursor: "pointer" }} onClick={() => setSelectedTag("All")}>
          All
        </Tag>
        {businessList.map((item, index) => {
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
              return <BusinessCard key={item._id} {...item} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const BusinessCard = (props) => {
  const onDelete = () => {
    Modal.info({
      title: " ",
      icon: null,
      content: <BusinessCardInfo {...props} />,
      okButtonProps: { style: { background: "teal", borderColor: "teal" } },
    });
  };

  return (
    <div className="pro-card card" onClick={() => onDelete()}>
      <div className="flex ci">
        {props.logo && (
          <aside>
            <img style={{ width: 70, height: 70, borderRadius: 40, marginRight: 10 }} src={props.logo} alt="" />
          </aside>
        )}
        <aside>
          <p className="type-tag">{props.business_type}</p>
          <h3>{props.name}</h3>
          <p>
            Location: {props.city}, {props.state}, {props.zip}
          </p>
          <p>Email: {props.email || "n/a"}</p>
        </aside>
      </div>
    </div>
  );
};

const BusinessCardInfo = (props) => {
  return (
    <div className="pro-card">
      <div className="flex jcsb">
        <h3>{props.name}</h3>
        <p className="type-tag">{props.business_type}</p>
      </div>
      <p>
        Location: {props.city}, {props.state}, {props.zip}
      </p>
      <p>Email: {props.email || "n/a"}</p>
      <p>Phone: {props.contact || "n/a"}</p>
      <p>Description: {props.description || "n/a"}</p>
    </div>
  );
};
