import React from "react";
import { Tag, Spin, Modal, Button, Avatar } from "antd";
import { execGetUserProfile } from "../api/apis";
import { useRouter } from "next/router";

export default function ViewProfile(props) {
  const [state, setState] = React.useState({
    loading: false,
    error: false,
    data: null,
  });

  const fetchProfile = async (user) => {
    setState({ loading: true, error: false, data: null });
    try {
      const res = await execGetUserProfile(user);
      setState({ loading: false, error: false, data: res });
    } catch (err) {
      setState({ loading: false, error: err, data: null });
    }
  };

  React.useEffect(() => {
    fetchProfile(props.user);
  }, [props.user]);

  const router = useRouter()

  return (
    <div>
      <Modal
        title="User Profile"
        visible={props.visible}
        maskClosable={false}
        onCancel={props.onCancel}
        centered
        footer={[
          state.data && state.data._id == JSON.parse(localStorage.getItem("data")).id
            ?
            <a></a>
            :
            <Button key="send-message" type="success" onClick={() => {
              router.push('/chat/' + state.data._id)
            }}>
              Send Message
          </Button>,
          <Button key="submit" type="primary" onClick={props.onCancel}>
            Ok
          </Button>,
        ]}
      >
        {state.error && <p className="text red center">{state.error.message}</p>}
        {state.loading && (
          <div className="flex jcc">
            <Spin size="large"></Spin>
          </div>
        )}
        {state.data && (
          <React.Fragment>
            {/* <header>
              <h1 className="title">General Details</h1>
            </header> */}
            <div className="names flex jcsb ci">
              {/* <img src={state.data.image} alt="" /> */}
              <div className="name">
                <h3>
                  {state.data.first_name} {state.data.last_name}{" "}
                </h3>
                <p>{state.data.email}</p>
              </div>
              {state.data.image && <img style={{ width: 65, height: 65, borderRadius: 65 }} src={state.data.image} alt="" />}
              {!state.data.image && (
                <Avatar style={{ background: "red", fontWeight: 700, width: 65, height: 65, marginRight: 10 }}>
                  <p style={{ fontSize: 16, marginTop: 15 }}>{state.data.first_name.substr(0, 1)}</p>
                </Avatar>
              )}
            </div>
            <br />
            <h3 className="info-item">
              <strong>Short Bio: </strong>
              {state.data.short_bio || ""}
            </h3>
            <br />
            {state.data.education && (state.data.education.become_mentor || state.data.education.become_mentor) && (
              <React.Fragment>
                <header>
                  <h1 className="title">Mentorship</h1>
                </header>
                {state.data.education && state.data.education.become_mentor && (
                  <div className="user-details-list-modal">
                    <h3>
                      <strong>Mentoring In: </strong>
                      {(state.data.education && state.data.education.mentoring_in) || "n/a"}
                    </h3>
                    <h3>
                      <strong>Available: </strong>
                      {state.data.education && state.data.education.become_mentor ? <Tag color="blue">Yes</Tag> : <Tag color="volcano">No</Tag>}
                    </h3>
                  </div>
                )}
                {state.data.education && state.data.education.need_mentoring && (
                  <div className="user-details-list-modal">
                    <h3>
                      <strong>Need Mentoring In: </strong>
                      {(state.data.education && state.data.education.need_mentoring_in) || "n/a"}
                    </h3>
                    <h3>
                      <strong>Needed: </strong>
                      {state.data.education && state.data.education.need_mentoring ? <Tag color="blue">Yes</Tag> : <Tag color="volcano">No</Tag>}
                    </h3>
                  </div>
                )}
                <br />
              </React.Fragment>
            )}

            <header>
              <h1 className="title">Education</h1>
            </header>
            <div className="user-details-list-modal">
              <h3>
                <strong>University: </strong>
                {(state.data.education && state.data.education.university) || "n/a"}
              </h3>
              <h3>
                <strong>Level: </strong>
                {(state.data.education && state.data.education.level) || "n/a"}
              </h3>
            </div>
            <div className="user-details-list-modal">
              <h3>
                <strong>Major: </strong>
                {(state.data.education && state.data.education.major) || "n/a"}
              </h3>
              <h3>
                <strong>Concentrations: </strong>
                {(state.data.education && state.data.education.concentrations) || "n/a"}
              </h3>
            </div>
            <br />
            <header>
              <h1 className="title">Location</h1>
            </header>
            <div className="user-details-list-modal">
              <h3>
                <strong>Home Town: </strong>
                {state.data.home_town || "n/a"}
              </h3>
              <h3>
                <strong>City: </strong>
                {(state.data.location && state.data.location.city) || "n/a"}
              </h3>
            </div>
            <div className="user-details-list-modal">
              <h3>
                <strong>State: </strong>
                {(state.data.location && state.data.location.state) || "n/a"}
              </h3>
              <h3>
                <strong>Zip Code: </strong>
                {(state.data.location && state.data.location.zip) || "n/a"}
              </h3>
            </div>
          </React.Fragment>
        )}
      </Modal>
    </div>
  );
}
