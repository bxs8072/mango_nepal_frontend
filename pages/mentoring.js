import { Tag, Input, Pagination } from "antd";
import { execGetMentors, execGetMentee } from "../api/apis";
import Loading from "../components/Loading";
import ModifiedButton from "../components/ModifiedButton";
import { BookOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import ViewProfile from "../modal/ViewProfile";
import LoginModal from "../modal/LoginModal";
import Link from "next/link";

function sortOn(property) {
  return function (a, b) {
    let dA;
    let dB;

    if (a.education && a.education[property]) dA = a.education[property].toLowerCase();
    else dA = "n/a";
    if (b.education && b.education[property]) dB = b.education[property].toLowerCase();
    else dB = "n/a";

    if (dA < dB) {
      return -1;
    } else if (dA > dB) {
      return 1;
    } else {
      return 0;
    }
  };
}

function sortOnName() {
  return function (a, b) {
    if (a.name && b.name) {
      const dA = a.name.toLowerCase();
      const dB = b.name.toLowerCase();
      if (dA < dB) {
        return -1;
      } else if (dA > dB) {
        return 1;
      } else {
        return 0;
      }
    }
    return 1;
  };
}

export default function education({ user_data, login }) {
  const [state, setState] = React.useState({
    data: null,
    loading: false,
    error: false,
  });

  const [sortName, setSortName] = React.useState(false);
  const [sortMentoring, setSortMentoring] = React.useState(false);

  const [formattedData, setFormattedData] = React.useState([]);
  const [fetchMentor, setFetchMentor] = React.useState(true);
  const [showLogin, setShowLogin] = React.useState(false);
  const [paginate, setPaginate] = React.useState({ total: 0, page: 1, per_page: 20, total_page: 0 });

  const [viewProfile, setViewProfile] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState(null);

  const nameSort = () => {
    let newData = [...state.data];
    const val = !sortName;
    if (val) {
      newData.sort(sortOnName());
    }
    setFormattedData(newData);
    setSortName(val);
  };

  const mentoringSort = () => {
    let newData = [...state.data];
    const val = !sortMentoring;
    if (val) {
      newData.sort(sortOn("mentoring_in"));
    }
    setFormattedData(newData);
    setSortMentoring(val);
  };

  const needMentoringSort = () => {
    let newData = [...state.data];
    const val = !sortMentoring;
    if (val) {
      newData.sort(sortOn("need_mentoring_in"));
    }
    setFormattedData(newData);
    setSortMentoring(val);
  };

  const fetchEducationMentor = async (q = "", page = false, per_page = false) => {
    setState({ loading: true, data: null, error: false });
    try {
      const res = await execGetMentors(q, page || paginate.page, per_page || paginate.per_page);
      setPaginate({ total: res.total, page: res.page, per_page: res.per_page, total_page: res.total_page });
      setState({ loading: false, data: res.data, error: false });
      setFormattedData(res.data);
    } catch (err) {
      setState({ loading: false, error: err, data: null });
    }
  };

  const fetchEducationMentee = async (q = "", page = false, per_page = false) => {
    setState({ loading: true, data: null, error: false });
    try {
      const res = await execGetMentee(q, page || paginate.page, per_page || paginate.per_page);
      setPaginate({ total: res.total, page: res.page, per_page: res.per_page, total_page: res.total_page });
      setState({ loading: false, data: res.data, error: false });
      setFormattedData(res.data);
    } catch (err) {
      setState({ loading: false, error: err, data: null });
    }
  };

  React.useEffect(() => {
    if (fetchMentor) fetchEducationMentor();
    if (!fetchMentor) fetchEducationMentee();
  }, [fetchMentor]);

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
              if (fetchMentor) fetchEducationMentor();
              if (!fetchMentor) fetchEducationMentee();
            }
          }}
        />
        <div className="wrap">
          <br />
          <div className="flex jcsb ci">
            <h2>Mentorship</h2>
          </div>
          <br />
          <p className="text red">You need to be logged in to view the content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="education">
      <ViewProfile visible={viewProfile} onCancel={() => setViewProfile(false)} user={userProfile} />

      <div className="wrap">
        <br />
        <div className="flex jcsb ci">
          <div className="flex ci">
            <h2 className="flex ci">
              <img className="in-icon" src="/svg/mentorship.svg" alt="" />
              <p> Mentorship</p>
            </h2>
            <div className="hgap"></div>
            <Link href="/tutoring">
              <a>
                <ModifiedButton size="small" onClick={() => {}} text="Tutoring" type="primary" />
              </a>
            </Link>
          </div>
          <div>
            <ModifiedButton
              onClick={() => {
                setFetchMentor(!fetchMentor);
              }}
              text={fetchMentor ? "Mentee List" : "Mentor List"}
              type="primary"
              icon={<BookOutlined />}
            />
          </div>
        </div>
        <br />
        <h2>{fetchMentor ? "Mentor List" : "Mentee List"}</h2>
        <br />
        <div className="flex jcsb">
          <div className="res-search">
            <Input.Search
              placeholder={fetchMentor ? "Search Mentors" : "Search Mentee"}
              onSearch={(val) => {
                if (fetchMentor) fetchEducationMentor(val);
                if (!fetchMentor) fetchEducationMentee(val);
              }}
              allowClear
              onChange={(e) => {
                if (!e.target.value) {
                  if (fetchMentor) fetchEducationMentor();
                  if (!fetchMentor) fetchEducationMentee();
                }
              }}
            ></Input.Search>
          </div>
          <Pagination
            onChange={(val) => {
              if (fetchMentor) fetchEducationMentor("", val);
              if (!fetchMentor) fetchEducationMentee("", val);
            }}
            total={paginate.total}
            current={paginate.page}
            showSizeChanger
            pageSize={paginate.per_page}
            onShowSizeChange={(val, perPage) => {
              if (fetchMentor) fetchEducationMentor("", val, perPage);
              if (!fetchMentor) fetchEducationMentee("", val, perPage);
            }}
          />
        </div>
        <br />
        {state.loading && <Loading />}
        {state.error && <p style={{ color: "red" }}>{state.error.message || "Unusual error occured, try again"}</p>}
        {state.data && formattedData && formattedData.length > 0 && (
          <React.Fragment>
            <div className="contents-table">
              <table cellPadding="0" cellSpacing="0">
                <ContentTableHead nameSort={nameSort} nameSortMode={sortName} mentoringSort={mentoringSort} mentoringSortMode={sortMentoring} needMentoringSort={needMentoringSort} fetchMentor={fetchMentor} />
                <tbody>
                  {formattedData.map((item, index) => {
                    return (
                      <ContentTableItems
                        viewProfile={(user) => {
                          setUserProfile(user);
                          setViewProfile(true);
                        }}
                        fetchMentor={fetchMentor}
                        key={item._id}
                        {...item}
                        sn={index + 1}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

const ContentTableHead = ({ fetchMentor, nameSort, nameSortMode, mentoringSort, mentoringSortMode, needMentoringSort }) => {
  return (
    <thead>
      <tr>
        <th style={{ maxWidth: "40px" }}>SN</th>
        <th style={{ cursor: "pointer" }} onClick={() => nameSort()}>
          Name
          {nameSortMode ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </th>
        <th
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (fetchMentor) mentoringSort();
            else needMentoringSort();
          }}
        >
          {fetchMentor ? "Mentoring In" : "Need Mentoring In"}
          {mentoringSortMode ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </th>
        <th>{fetchMentor ? "Available" : "Needed"}</th>
        <th>Contact</th>
      </tr>
    </thead>
  );
};

const ContentTableItems = (props) => {
  return (
    <tr>
      <td>{props.sn}</td>
      <td>
        <p
          onClick={() => {
            props.viewProfile(props._id);
          }}
          style={{ color: "#1890ff", cursor: "pointer" }}
        >
          {props.image && <img style={{ width: 20, height: 20, borderRadius: 20, marginRight: 3, marginTop: "-3px" }} src={props.image} alt="" />}
          {props.name}
        </p>
      </td>
      <td>
        <div>{(props.education && (props.fetchMentor ? props.education.mentoring_in : props.education.need_mentoring_in)) || "n/a"}</div>
      </td>
      <td>
        {props.fetchMentor && <div>{props.education && props.education.become_mentor ? <Tag color="success">Yes</Tag> : <Tag color="volcano">No</Tag>}</div>}
        {!props.fetchMentor && <div>{props.education && props.education.need_mentoring ? <Tag color="success">Yes</Tag> : <Tag color="volcano">No</Tag>}</div>}
      </td>
      <td>
        <div>{props.email}</div>
        <div>{props.phone_number}</div>
      </td>
    </tr>
  );
};
