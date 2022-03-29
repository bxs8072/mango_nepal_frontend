import { Button, Tag, Modal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { execGetMyBlog, execDeleteMyBlog } from "../api/apis";
import Loading from "../components/Loading";
import ModifiedButton from "../components/ModifiedButton";
import Link from "next/link";
import { getRoleColor } from "../utils/helpers";
import { notifySuccess, notifyError } from "../utils/notification";
// import Loading from "../../../Components/Loading";
// import { execGetBlog } from "../../../api/apiCalls";
// import { Link } from "react-router-dom";
// import { getRoleColor } from "../../../config";

export default function Blogs() {
  const [state, setState] = React.useState({
    loading: true,
    data: null,
    error: false,
  });

  const fetchUsers = async () => {
    setState({ ...state, loading: true });
    try {
      const res = await execGetMyBlog();
      console.log(res);
      setState({ loading: false, data: res, error: false });
    } catch (err) {
      console.log(err);
      setState({ loading: false, data: null, error: err });
    }
  };

  React.useEffect(() => {
    fetchUsers();
    //eslint-disable-next-line
  }, []);

  return (
    <section id="contents" className="wrap">
      <br />
      <div className="flex jcsb">
        <h1 className="title"> Blogs </h1>
        <Link href="/write_blog">
          <a>
            <ModifiedButton type="primary" icon={<PlusOutlined />} text="Write Blog" />
          </a>
        </Link>
      </div>
      <br />
      {state.loading && <Loading />}
      {state.error && <p style={{ color: "red" }}>{state.error.message}</p>}
      {state.data && state.data.data.length > 0 && (
        <React.Fragment>
          <div className="contents-table">
            <table cellPadding="0" cellSpacing="0">
              <ContentTableHead />
              <tbody>
                {state.data.data.map((item, index) => {
                  return <ContentTableItems refresh={fetchUsers} key={item.id} {...item} sn={index + 1} />;
                })}
              </tbody>
            </table>
          </div>
        </React.Fragment>
      )}
    </section>
  );
}

const ContentTableHead = () => {
  return (
    <thead>
      <tr>
        <th style={{ maxWidth: "40px" }}>SN</th>
        <th>Title</th>
        <th>User</th>
        <th>Likes</th>
        <th>Status</th>
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
      content: "you want to delete this blog permanently.",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const res = await execDeleteMyBlog(props._id);
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
          <div className="flex jcc ci">
            <img src={props.cover_photo} className="blog-item-img" alt="" />
            <aside>
              <Link href="/blog/[slug]" as={"/blog/" + props.slug}>
                <a>{props.title}</a>
              </Link>
            </aside>
          </div>
        </div>
      </td>
      <td>{(props.user && props.user.first_name + " " + props.user.last_name) || "n/a"}</td>
      <td>{props.like_count}</td>
      <td>
        <Tag color={getRoleColor(props.status)}>{props.status}</Tag>
      </td>
      <td>{props.created_at}</td>
      <td className="actions flex jcc" style={{ marginTop: 7 }}>
        <Link href="/edit_blog/[id]" as={"/edit_blog/" + props._id}>
          <a>
            <Button shape="circle" icon={<EditOutlined />} size="small" type="primary" />
          </a>
        </Link>
        <div className="hgap"></div>
        <Button onClick={() => onDelete()} shape="circle" icon={<DeleteOutlined />} size="small" type="danger" />
      </td>
    </tr>
  );
};
