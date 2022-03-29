import { baseUrl, execGetComment, execAddComment, execDeleteComment, execDoLike } from "../../api/apis";
import Head from "next/head";
import { axiosInstanceSSR } from "../../api/ssrInterceptor";
import parse from "html-react-parser";
import { TwitterOutlined, LikeOutlined, CommentOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Form, Spin, Modal, Avatar } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { doShare } from "../../utils/helpers";
import { notifyError, notifySuccess } from "../../utils/notification";
import Link from "next/link";
import ViewProfile from "../../modal/ViewProfile";
import ModifiedButton from "../../components/ModifiedButton";

// import "../../css/_quill.scss";

export default function blog({ data, error, slug, title, user_data }) {
  const [form] = Form.useForm();
  const [comment, setComment] = React.useState({
    data: null,
    loading: false,
    error: false,
  });

  const [fewComment, setFewComment] = React.useState([]);
  const [showFewComment, setShowFewComment] = React.useState(true);

  const [loaders, setLoaders] = React.useState({
    like: false,
    comment: false,
  });
  const [justLiked, setJustLiked] = React.useState(false);

  const [viewProfile, setViewProfile] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState(null);

  const fetchComment = async () => {
    if (!data) return;
    setComment({ loading: true, data: null, error: false });
    try {
      const res = await execGetComment(slug);
      setComment({ loading: false, data: res, error: false });
      const fewCmt = res.filter((item, index) => index < 3);
      setFewComment(fewCmt);
    } catch (err) {
      setComment({ loading: false, data: null, error: err });
    }
  };

  React.useEffect(() => {
    fetchComment();
  }, []);

  const onComment = async (val) => {
    console.log(val);
    setLoaders({ ...loaders, comment: true });
    try {
      const res = await execAddComment(slug, val);
      notifySuccess(res.message);
      form.setFieldsValue({ comment: "" });
      fetchComment();
      setLoaders({ ...loaders, comment: false });
    } catch (err) {
      setLoaders({ ...loaders, comment: false });
      notifyError(err.message);
    }
  };

  const onLike = async () => {
    setLoaders({ ...loaders, like: true });
    try {
      const res = await execDoLike(slug);
      notifySuccess(res.message);
      setJustLiked(true);
      setLoaders({ ...loaders, like: false });
    } catch (err) {
      setLoaders({ ...loaders, like: false });
      notifyError(err.message);
    }
  };

  return (
    <div>
      <Head>
        <title>{title || "Mango Nepal"}</title>
        <meta property="og:type" content="Connecting Professionals" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content="Mango Nepal" />
        <meta property="og:image" content={data.cover_photo} />
      </Head>
      <ViewProfile visible={viewProfile} onCancel={() => setViewProfile(false)} user={userProfile} />

      <div className="wrap">
        {error && <ErrMessage message={error.message} />}
        {data && (
          <div className="blog-wrapper">
            <div className="blog-details">
              <header>
                <h1>
                  <b>{title}</b>
                </h1>
                <p>
                  by{" "}
                  <strong
                    onClick={() => {
                      if (data.user) {
                        if (data.user.role != "Admin") {
                          setUserProfile(data.user._id);
                          setViewProfile(true);
                        }
                      }
                    }}
                    style={{ color: "#1890ff", cursor: "pointer" }}
                  >
                    {(data.user && data.user.first_name + " " + data.user.last_name) || "Admin"}
                  </strong>
                  {", "}
                  <span>{data.created_at}</span>
                </p>
                <div className="share">
                  <span className="fb" onClick={() => doShare("fb")}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "30px", fill: "#fff" }} viewBox="0 0 320 512">
                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                  </span>
                  <span className="tw" onClick={() => doShare("tw")}>
                    <TwitterOutlined style={{ color: "#fff", fontSize: 30 }} />
                  </span>
                  <span className="li" onClick={() => doShare("li")}>
                    <svg style={{ height: "30px", fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                    </svg>
                  </span>
                </div>
              </header>
              {data.cover_photo && (
                <div className="cover">
                  <img src={data.cover_photo} alt="" />
                </div>
              )}
              <div className="content-blog ck-content">{parse(data.body)}</div>
              <br />
              <br />
              <br />
              <div className="controls flex ci">
                <div className="like flex ci">
                  <Button shape="round" loading={loaders.like} onClick={() => onLike()}>
                    <p className="flex ci">
                      <img style={{ width: 16 }} src="../svg/like.svg" alt="" />
                      <p>{justLiked ? parseInt(data.like_count) + 1 : data.like_count}</p>
                    </p>
                  </Button>
                </div>
                <div className="comment flex ci">
                  <Button shape="round" loading={comment.loading} icon={<CommentOutlined />}>
                    {comment.data && " " + comment.data.length}
                  </Button>
                </div>
              </div>
              <div className="comments">
                <h2>Comments</h2>
                {!user_data && <p className="text red">You need to sign in to be able to comment</p>}
                {user_data && (
                  <Form onFinish={onComment} form={form}>
                    <div className="comment-controls">
                      <Spin style={{ width: "70%" }} spinning={loaders.comment}>
                        <Form.Item name="comment" style={{ width: "70%" }}>
                          <TextArea
                            placeholder="Write Comment Here"
                            onKeyDown={(e) => {
                              if (e.which === 13 && !e.shiftKey) {
                                e.preventDefault();
                                form.submit();
                              }
                            }}
                          />
                        </Form.Item>
                      </Spin>
                      <div className="comment-button">
                        <Button onClick={() => form.submit()} type="parimary" style={{ height: "100%" }}>
                          Post
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
                {comment.loading && (
                  <div>
                    <br />
                    <Spin size="large" />
                    <br />
                    <br />
                  </div>
                )}
                {comment.error && (
                  <React.Fragment>
                    <br />
                    <p className="text red">{comment.error.message}</p>
                    <br />
                    <br />
                  </React.Fragment>
                )}
                {comment.data && (
                  <React.Fragment>
                    {showFewComment && (
                      <React.Fragment>
                        {fewComment.map((item) => (
                          <CommentItem {...item} user_role={(user_data && user_data.role) || ""} key={item._id} refresh={fetchComment} />
                        ))}
                      </React.Fragment>
                    )}
                    {!showFewComment && (
                      <React.Fragment>
                        {comment.data.map((item) => (
                          <CommentItem {...item} user_role={(user_data && user_data.role) || ""} key={item._id} refresh={fetchComment} />
                        ))}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
                <div>
                  <ModifiedButton text={showFewComment ? "Show More Comment" : "Show Less Comment"} type="primary" onClick={() => setShowFewComment(!showFewComment)} />
                </div>
              </div>
            </div>
            <div className="more-blog">{data && data.more && <Suggested data={data.more} />}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const CommentItem = ({ created_at, comment, user, is_my_comment, _id, refresh, user_role }) => {
  const onDelete = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "you want to delete this comment",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const res = await execDeleteComment(_id);
          notifySuccess(res.message);
          refresh();
        } catch (err) {
          notifyError(err.message);
        }
      },
    });
  };

  return (
    <div className="comment-item flex jcsb">
      <div className="flex">
        <aside>
          {user && user.image && <img src={user.image} alt="" />}
          {(!user || !user.image) && (
            <Avatar style={{ background: "red", fontWeight: 700, width: 50, height: 50, marginRight: 5 }}>
              <p style={{ fontSize: 16, marginTop: 8 }}>{user ? user.first_name.substr(0, 1) : "D"}</p>
            </Avatar>
          )}
        </aside>
        <aside>
          <p>
            {" "}
            <strong>{(user && user.first_name + " " + user.last_name) || "Deleted User"}</strong> &nbsp; <span style={{ fontSize: 12 }}>{created_at}</span>
          </p>
          <h3>{comment}</h3>
        </aside>
      </div>
      <aside>{(is_my_comment || user_role == "Admin") && <Button shape="circle" onClick={() => onDelete()} icon={<DeleteOutlined />}></Button>}</aside>
    </div>
  );
};

const Suggested = ({ data }) => (
  <div className="suggested">
    <header>
      <h1 className="section-title flex ci">
        {/* <img src="images/award.svg" alt="" /> */}
        <span style={{ marginLeft: 5 }}>More Reads </span>
      </h1>
    </header>
    <div className="content-wrapx">
      {data.map((item) => (
        <Link key={item._id} href="/blog/[slug]" as={"/blog/" + item.slug}>
          <a>
            <div className="content flex jcsb ci">
              <aside className="left">
                <p className="text dim">{item.created_at}</p>
                <h1 className="article-title">{item.title}</h1>
                <p className="text dim">
                  {item.user && item.user.first_name} {item.user && item.user.last_name}
                </p>
              </aside>
              <aside className="right">
                <img src={item.cover_photo} alt="" />
              </aside>
            </div>
          </a>
        </Link>
      ))}
    </div>
  </div>
);

const ErrMessage = ({ message }) => (
  <div className="text center" style={{ marginTop: 100 }}>
    <img style={{ width: "300px", maxWidth: "90%" }} src="/images/not_found.svg" alt="" />
    <br />
    <br />
    <h3 className="text red">{message}</h3>
  </div>
);

blog.getInitialProps = async ({ query }) => {
  const slug = query.slug;
  try {
    const res = await axiosInstanceSSR.get(baseUrl + "/blog/" + slug);
    return { slug, data: res, title: res.title };
  } catch (err) {
    return { slug, error: err };
  }
};
