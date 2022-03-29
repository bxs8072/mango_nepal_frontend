import { Tag, Switch, Button, Modal, Upload, Avatar } from "antd";
import { execGetMyProfile, execUpdateProfile, execDeleteMyself, baseUrl } from "../api/apis";
import Loading from "../components/Loading";
import { getRoleColor } from "../utils/helpers";
import "../css/_userDetails.scss";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import ModifiedButton from "../components/ModifiedButton";
import EditGeneralDetails from "../modal/EditGeneralDetails";
import EditLocation from "../modal/EditLocation";
import EditEducation from "../modal/EditEducation";
import EditMentoring from "../modal/EditMentoring";
import { notifyError, notifySuccess } from "../utils/notification";
import { useRouter } from "next/router";
import ModalChangePassword from "../modal/ChangePassword";

const privacyNames = {
  name: "share_name",
  email: "share_email",
  phone: "share_phone",
};

export default function UserDetails({ logout, token }) {
  const [state, setState] = React.useState({
    loading: false,
    data: null,
    error: false,
  });
  const [showEditGeneralDetails, setShowEditGeneralDetails] = React.useState(false);
  const [showLocation, setShowLocation] = React.useState(false);
  const [showEducation, setShowEducation] = React.useState(false);
  const [showMentoring, setShowMentoring] = React.useState(false);
  const [showChangePassword, setShowChangePassword] = React.useState(false);

  const router = useRouter();

  const fetchUser = async () => {
    setState({ ...state, loading: true });
    try {
      const res = await execGetMyProfile();
      console.log(res);
      setState({ loading: false, error: false, data: res });
    } catch (err) {
      setState({ loading: false, error: err, data: null });
    }
  };

  const updatePrivacy = async (key, value) => {
    const payload = {
      privacy: {
        [key]: value,
      },
    };
    try {
      const res = await execUpdateProfile(payload);
      notifySuccess(res.message);
    } catch (err) {
      notifyError(err.message);
    }
  };

  const onDelete = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "you want to delete your account permanently.",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const res = await execDeleteMyself();
          notifySuccess(res.message);
          logout();
          router.push("/");
        } catch (err) {
          notifyError(err.message);
        }
      },
    });
  };

  const updateDp = async (url) => {
    const payload = { image: url };
    try {
      const res = await execUpdateProfile(payload);
      fetchUser();
      notifySuccess(res.message);
    } catch (err) {
      notifyError(err.message);
    }
  };

  const uploadDatas = {
    name: "file",
    action: baseUrl + "/upload",
    headers: {
      authorization: token ? "Bearer " + token : "",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        updateDp(info.file.response.url);
      } else if (info.file.status === "error") {
        notifyError("File upload failed, looks like you are not logged in");
      }
    },
  };

  React.useEffect(() => {
    fetchUser();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="wrap">
      <EditGeneralDetails
        visible={showEditGeneralDetails}
        data={state.data}
        onCancel={(refresh = false) => {
          setShowEditGeneralDetails(false);
          if (refresh === true) fetchUser();
        }}
      />
      <ModalChangePassword
        visible={showChangePassword}
        onCancel={() => {
          setShowChangePassword(false);
        }}
      />
      <EditLocation
        visible={showLocation}
        data={state.data}
        onCancel={(refresh = false) => {
          setShowLocation(false);
          if (refresh === true) fetchUser();
        }}
      />
      <EditEducation
        visible={showEducation}
        data={state.data}
        onCancel={(refresh = false) => {
          setShowEducation(false);
          if (refresh === true) fetchUser();
        }}
      />
      <EditMentoring
        visible={showMentoring}
        data={state.data}
        onCancel={(refresh = false) => {
          setShowMentoring(false);
          if (refresh === true) fetchUser();
        }}
      />
      <section id="user-details">
        <br />
        <header className="flex jcsb">
          <h1 className="title">General Details</h1>
          {state.data && <ModifiedButton text="Edit General Details" type="primary" onClick={() => setShowEditGeneralDetails(true)} icon={<EditOutlined />} />}
        </header>
        {state.loading && <Loading />}
        {state.data && (
          <React.Fragment>
            <div className="card">
              <div className="names flex ci">
                {state.data.image && <img src={state.data.image} alt="" />}
                {!state.data.image && (
                  <Avatar style={{ background: "red", fontWeight: 700, width: 50, height: 50, marginRight: 10 }}>
                    <p style={{ fontSize: 16, marginTop: 8 }}>{state.data.first_name.substr(0, 1)}</p>
                  </Avatar>
                )}
                <div className="name">
                  <h3>
                    {state.data.first_name} {state.data.last_name}{" "}
                  </h3>
                  <p>{state.data.email}</p>
                </div>
              </div>
              <br />
              <Upload {...uploadDatas} showUploadList={false}>
                <Button>
                  <UploadOutlined /> Upload Picture
                </Button>
              </Upload>
              <br />
              <br />
              <h3 className="info-item">
                <strong>Short Bio: </strong>
                {state.data.short_bio || "n/a"}
              </h3>
              <div className="user-details-list">
                <h3>
                  <strong>Role: </strong>
                  <Tag color={getRoleColor(state.data.role)}>{state.data.role}</Tag>
                </h3>

                <h3>
                  <strong>Gender:</strong> {state.data.gender}
                </h3>
                <h3>
                  <strong>Age Range:</strong> {state.data.age_range || "n/a"}
                </h3>
                <h3>
                  <strong>Phone Number: </strong>
                  {state.data.phone_number || "n/a"}
                </h3>

                <h3>
                  <strong>Google Account: </strong>
                  {state.data.google ? <Tag color="blue">True</Tag> : <Tag color="volcano">False</Tag>}
                </h3>
              </div>
            </div>
            <br />
            <header>
              <h1 className="title">Privacy</h1>
            </header>
            <div className="card">
              {/* <div className="flex ci">
                <p>
                  <strong>Share your name publicly on this website?</strong>
                </p>
                <div className="hgap"></div>
                <Switch onChange={(val) => updatePrivacy(privacyNames.name, val)} size="small" defaultChecked={state.data.privacy && state.data.privacy.share_name} />
              </div>
              <div className="flex ci">
                <p>
                  <strong>Share your email publicly on this website?</strong>
                </p>
                <div className="hgap"></div>
                <Switch onChange={(val) => updatePrivacy(privacyNames.email, val)} size="small" defaultChecked={state.data.privacy && state.data.privacy.share_email} />
              </div> */}
              <div className="flex ci">
                <p>
                  <strong>Share your phone number publicly on this website?</strong>
                </p>
                <div className="hgap"></div>
                <Switch onChange={(val) => updatePrivacy(privacyNames.phone, val)} size="small" defaultChecked={state.data.privacy && state.data.privacy.share_phone} />
              </div>
            </div>
            <br />
            <header className="flex jcsb">
              <h1 className="title">Mentorship</h1>
              <ModifiedButton text="Edit Mentoring" type="primary" onClick={() => setShowMentoring(true)} icon={<EditOutlined />} />
            </header>
            <div className="card">
              <div className="user-details-list">
                <h3>
                  <strong>Mentoring In: </strong>
                  {(state.data.education && state.data.education.mentoring_in) || "n/a"}
                </h3>
                <h3>
                  <strong>Available: </strong>
                  {state.data.education && state.data.education.become_mentor ? <Tag color="blue">Yes</Tag> : <Tag color="volcano">No</Tag>}
                </h3>
                <h3>
                  <strong>Need Mentoring In: </strong>
                  {(state.data.education && state.data.education.need_mentoring_in) || "n/a"}
                </h3>
                <h3>
                  <strong>Needed: </strong>
                  {state.data.education && state.data.education.need_mentoring ? <Tag color="blue">Yes</Tag> : <Tag color="volcano">No</Tag>}
                </h3>
              </div>
            </div>

            <br />
            <header className="flex jcsb">
              <h1 className="title">Highest level of education</h1>
              <ModifiedButton text="Edit Education" type="primary" onClick={() => setShowEducation(true)} icon={<EditOutlined />} />
            </header>

            <div className="card">
              <div className="user-details-list">
                <h3>
                  <strong>University: </strong>
                  {(state.data.education && state.data.education.university) || "n/a"}
                </h3>
                <h3>
                  <strong>Level: </strong>
                  {(state.data.education && state.data.education.level) || "n/a"}
                </h3>
                <h3>
                  <strong>Major: </strong>
                  {(state.data.education && state.data.education.major) || "n/a"}
                </h3>
                <h3>
                  <strong>Concentrations: </strong>
                  {(state.data.education && state.data.education.concentrations) || "n/a"}
                </h3>
                <h3>
                  <strong>Graduated: </strong>
                  {state.data.education && state.data.education.graduated ? <Tag color="blue">Yes</Tag> : <Tag color="volcano">No</Tag>}
                </h3>
                <h3>
                  <strong>Graduated Year: </strong>
                  {(state.data.education && state.data.education.graduation_year) || "n/a"}
                </h3>
              </div>
            </div>
            <br />
            <header className="flex jcsb">
              <h1 className="title">Location</h1>
              <ModifiedButton text="Edit Location" type="primary" onClick={() => setShowLocation(true)} icon={<EditOutlined />} />
            </header>
            <div className="card">
              <div className="user-details-list">
                <h3>
                  <strong>Home Town: </strong>
                  {state.data.home_town || "n/a"}
                </h3>
                <h3>
                  <strong>City: </strong>
                  {(state.data.location && state.data.location.city) || "n/a"}
                </h3>
                <h3>
                  <strong>State: </strong>
                  {(state.data.location && state.data.location.state) || "n/a"}
                </h3>
                <h3>
                  <strong>Zip Code: </strong>
                  {(state.data.location && state.data.location.zip) || "n/a"}
                </h3>
              </div>
            </div>

            <br />
            <header className="flex jcsb" style={{ marginBottom: 5 }}>
              <h1 className="title">Actions</h1>
            </header>
            <ModifiedButton
              onClick={() => {
                setShowChangePassword(true);
              }}
              icon={<EditOutlined />}
              type="primary"
              text="Change Password"
            />
            <div className="hgap"></div>
            <ModifiedButton onClick={() => onDelete()} icon={<DeleteOutlined />} type="primary" text="Delete My Account" />
          </React.Fragment>
        )}
        <br />
        <br />
      </section>
    </div>
  );
}
