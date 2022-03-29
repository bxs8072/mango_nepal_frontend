import React from "react";
import QuillNoSSRWrapper from "../components/Quill";
import "../css/_quill.scss";
import { Input, Form } from "antd";
import { execFileUpload, execAddBlog } from "../api/apis";
import { notifySuccess, notifyError } from "../utils/notification";
import ModifiedButton from "../components/ModifiedButton";
import { useRouter } from "next/router";
const quillRef = React.createRef();

export default function AddEvents() {
  const [fileChange, setFileChange] = React.useState(null);
  const [fileUploaded, setFileUploaded] = React.useState({});
  const [fileUploadLoading, setFileUploadLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [body, setBody] = React.useState("");
  const fileRef = React.createRef();
  const router = useRouter();
  const [form] = Form.useForm();

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
      const res = await execAddBlog(payload);
      notifySuccess(res.message);
      router.push("/");
    } catch (err) {
      notifyError(err.message);
    }
  };

  React.useEffect(() => {
    router.prefetch("/");
  });

  const insImg = React.useCallback(() => insertImage(setBody), []);

  return (
    <section id="contents" className="wrap">
      <br />
      <h1 className="title">
        <b>Write Blog</b>
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
          <br />
        </Form>
        <br />
      </div>
      <div className="add-editor">
        <QuillNoSSRWrapper
          theme="snow"
          onChange={(value) => {
            setBody(value);
          }}
          value={body}
          ref={quillRef}
          modules={modules(insImg)}
          formats={formats}
          bounds={".add-editor"}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <ModifiedButton text="Post Blog" onClick={() => form.submit()} loading={loading} type="primary" />
        <p style={{ marginTop: 10, fontSize: 12 }}>
          <b>Note:</b> After submission, your blog will reviewed before posting by MangoNepal.
        </p>
      </div>
    </section>
  );
}

const insertImage = (sB) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();
  input.onchange = async () => {
    const file = input.files[0];
    const formData = new FormData();
    formData.append("file_for", "BLOG_BODY");
    formData.append("file", file);
    let res = {};
    try {
      res = await execFileUpload(formData);
    } catch (err) {
      return;
    }
    sB((pB) => pB + '<p><img src="' + res.url + '" alt=""/></p>');
  };
};

const modules = (insertImg) => {
  return {
    toolbar: {
      handlers: {
        image: insertImg,
      },
      container: [[{ header: "1" }, { header: "2" }], [{ size: [] }], ["bold", "italic", "underline", "strike"], ["blockquote", "code-block"], [{ color: [] }], [{ script: "sub" }, { script: "super" }], [{ align: [] }], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]],
    },
    clipboard: {
      matchVisual: false,
    },
    // syntax: true,
  };
};

const formats = ["header", "font", "size", "bold", "italic", "underline", "strike", "align", "blockquote", "list", "bullet", "indent", "link", "image", "video", "color", "code-block", "script"];
