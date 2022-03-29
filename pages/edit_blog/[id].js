import React from "react";
import { Input, Form } from "antd";
import { execFileUpload, baseUrl, execUpdateMyBlog } from "../../api/apis";
import { notifySuccess, notifyError } from "../../utils/notification";
import ModifiedButton from "../../components/ModifiedButton";
import { useRouter } from "next/router";
import { axiosInstanceSSR } from "../../api/ssrInterceptor";
import CkEditorNoSSR from "../../components/CkEditorNoSSR";

export default function edit_blog({ data, error }) {
  const [fileChange, setFileChange] = React.useState(null);
  const [fileUploaded, setFileUploaded] = React.useState({});
  const [fileUploadLoading, setFileUploadLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [body, setBody] = React.useState("");
  const fileRef = React.createRef();
  const router = useRouter();
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (data) {
      setFileUploaded(data.cover_photo);
      form.setFieldsValue({ title: data.title });
      setBody(data.body);
    }
  }, [data]);

  React.useEffect(() => {
    if (error) {
      notifyError(error.message);
      router.push("/my_blog");
    }
  }, [error]);

  const addFile = () => {
    const data = new FormData();
    data.append("file", fileChange);
    data.append("file_for", "BLOG_COVER");
    setFileUploadLoading(true);
    execFileUpload(data)
      .then((res) => {
        setFileUploaded({ id: res.id, url: res.url });
        setFileUploadLoading(false);
        notifySuccess(res.message);
      })
      .catch((err) => {
        setFileUploadLoading(false);
        notifyError(err.message);
      });
  };

  React.useEffect(() => {
    if (fileChange !== null) {
      addFile();
    }
    //eslint-disable-next-line
  }, [fileChange]);

  const addEvent = async (value) => {
    let payload;
    if (!fileUploaded || !fileUploaded.id) {
      payload = { ...value, body };
    } else {
      payload = { ...value, body, cover_photo: fileUploaded.id };
    }
    setLoading(true);
    try {
      const res = await execUpdateMyBlog(data._id, payload);
      notifySuccess(res.message);
      router.push("/my_blog");
    } catch (err) {
      notifyError(err.message);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    router.prefetch("/my_blog");
  });

  return (
    <section id="contents" className="wrap">
      <br />
      <h1 className="title">
        <b>Update Blog</b>
      </h1>
      <input
        type="file"
        onChange={(e) => {
          setFileChange(e.target.files[0]);
        }}
        ref={fileRef}
        style={{ display: "none" }}
      />

      <br />

      <div className="inputs">
        <Form form={form} onFinish={addEvent}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gridGap: 15,
            }}
          >
            <aside>
              <div
                className="cover"
                style={{
                  background: "#fff",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  height: 150,
                  boxShadow: "var(--shadow)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                {fileUploaded.id && (
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={fileUploaded.url}
                    alt=""
                  />
                )}
              </div>
            </aside>
            <aside>
              <Form.Item
                label="Title"
                name="title"
                className="full"
                rules={[
                  {
                    required: true,
                    message: "Title is required",
                  },
                ]}
              >
                <Input placeholder="eg. this is a blog" />
              </Form.Item>
              <br />
              <ModifiedButton
                type="primary"
                loading={fileUploadLoading}
                onClick={() => {
                  fileRef.current.click();
                }}
                text="Upload Cover Photo"
              />
              <p style={{ marginTop: 10, fontSize: 12 }}>
                <b>Note:</b> Max file size 10MB
              </p>
            </aside>
          </div>
        </Form>
        <br />
      </div>
      <div className="add-editor">
        <CkEditorNoSSR setBody={setBody} data={body} />
      </div>
      <div style={{ textAlign: "center" }}>
        <ModifiedButton text="Update Blog" onClick={() => form.submit()} loading={loading} type="primary" />
      </div>
    </section>
  );
}

edit_blog.getInitialProps = async ({ query }) => {
  const id = query.id;
  try {
    const res = await axiosInstanceSSR.get(baseUrl + "/my/blog/" + id);
    return { data: res };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};
