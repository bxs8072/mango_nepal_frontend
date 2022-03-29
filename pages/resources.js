import { execGetResource, execDeleteResource } from "../api/apis";
import Loading from "../components/Loading";
import ModifiedButton from "../components/ModifiedButton";
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined, PaperClipOutlined } from "@ant-design/icons";
import AddResource from "../modal/AddResource";
import { Button, Modal, Input } from "antd";
import { notifySuccess, notifyError } from "../utils/notification";

export default function business({ user_data }) {
  const [state, setState] = React.useState({
    data: null,
    loading: false,
    error: false,
  });
  const [showAdd, setShowAdd] = React.useState(false);

  const fetchResource = async (q = "") => {
    setState({ loading: true, data: null, error: false });
    try {
      const res = await execGetResource(q);
      setState({ loading: false, data: res, error: false });
    } catch (err) {
      setState({ loading: false, error: err, data: null });
    }
  };

  React.useEffect(() => {
    fetchResource();
  }, []);

  return (
    <div className="education">
      <AddResource
        visible={showAdd}
        onCancel={(refresh = false) => {
          setShowAdd(false);
          if (refresh === true) fetchResource();
        }}
      />
      <div className="wrap">
        <br />
        <div className="flex jcsb ci">
          <h2 className="flex ci">
            <PaperClipOutlined />
            <p style={{ marginLeft: 5 }}> Resources</p>
          </h2>
          <ModifiedButton onClick={() => setShowAdd(true)} text="Add Resource" type="primary" icon={<PlusOutlined />} />
        </div>
        <br />
        <div className="res-search">
          <Input.Search
            placeholder="Search Resource"
            onSearch={(val) => {
              fetchResource(val);
            }}
            allowClear
            onChange={(e) => {
              if (!e.target.value) fetchResource();
            }}
          ></Input.Search>
        </div>
        <br />
        {state.loading && <Loading />}
        {state.error && <p style={{ color: "red" }}>{state.error.message || "Unusual error occured, try again"}</p>}
        {/* {state.data} */}
        {state.data && state.data.length > 0 && (
          <div className="pro-wrapperx">
            <div className="contents-table">
              <table cellPadding="0" cellSpacing="0">
                <ContentTableHead />
                <tbody>
                  {state.data.map((item, index) => {
                    return <ContentTableItems authUser={(user_data && user_data.id) || ""} refresh={fetchResource} key={item._id} {...item} sn={index + 1} />;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ContentTableHead = () => {
  return (
    <thead>
      <tr>
        <th style={{ maxWidth: "40px" }}>SN</th>
        <th>Title</th>
        <th style={{ maxWidth: "200px" }}>Created At</th>
        <th style={{ maxWidth: "200px" }}>Actions</th>
      </tr>
    </thead>
  );
};

const ContentTableItems = (props) => {
  const onDelete = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "you want to delete this resource permanently.",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const res = await execDeleteResource(props._id);
          notifySuccess(res.message);
          props.refresh();
        } catch (err) {
          notifyError(err.message);
        }
      },
    });
  };

  return (
    <tr>
      <td>{props.sn}</td>
      <td>
        <div>
          <p>
            <b>{props.title}</b>
          </p>
          <p>
            <a href={props.link} target="_blank">
              {props.link}
            </a>
          </p>
        </div>
      </td>
      <td>{props.created_at}</td>
      <td className="actions">
        {props.user == props.authUser && (
          <React.Fragment>
            <Button shape="circle" icon={<DeleteOutlined />} onClick={() => onDelete()} size="small" type="danger" />
          </React.Fragment>
        )}
      </td>
    </tr>
  );
};
