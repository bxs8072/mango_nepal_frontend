import { Tag, Select, Input, Pagination } from "antd";
import { execGetEducation, execGetMentors } from "../api/apis";
import Loading from "../components/Loading";
import ModifiedButton from "../components/ModifiedButton";
import Link from "next/link";
import { PieChartOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import ViewProfile from "../modal/ViewProfile";
import LoginModal from "../modal/LoginModal";
// import { Head } from "next/head";

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
  const [formattedData, setFormattedData] = React.useState(null);
  const [selectedTag, setSelectedTag] = React.useState("All");
  const [sortLevel, setSortLevel] = React.useState(false);
  const [sortName, setSortName] = React.useState(false);
  const [sortUni, setSortUni] = React.useState(false);
  const [sortMajor, setSortMajor] = React.useState(false);
  const [paginate, setPaginate] = React.useState({ total: 0, page: 1, per_page: 20, total_page: 0 });

  const [viewProfile, setViewProfile] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState(null);
  const [showLogin, setShowLogin] = React.useState(false);

  const levelSort = () => {
    let newData = [...state.data];
    const val = !sortLevel;
    if (val) {
      newData.sort(sortOn("level"));
    }
    setFormattedData(newData);
    setSortLevel(val);
    console.log(sortLevel);
  };

  const uniSort = () => {
    let newData = [...state.data];
    const val = !sortUni;
    if (val) {
      newData.sort(sortOn("university"));
    }
    setFormattedData(newData);
    setSortUni(val);
  };

  const majorSort = () => {
    let newData = [...state.data];
    const val = !sortMajor;
    if (val) {
      newData.sort(sortOn("major"));
    }
    setFormattedData(newData);
    setSortMajor(val);
  };

  const nameSort = () => {
    let newData = [...state.data];
    const val = !sortName;
    if (val) {
      newData.sort(sortOnName());
    }
    setFormattedData(newData);
    setSortName(val);
  };

  const fetchEducationLevel = async (q = "", page = false, per_page = false) => {
    setState({ loading: true, data: null, error: false });

    try {
      const res = await execGetEducation(selectedTag, q, page || paginate.page, per_page || paginate.per_page);
      setPaginate({ total: res.total, page: res.page, per_page: res.per_page, total_page: res.total_page });
      setState({ loading: false, data: res.education, error: false });
      setFormattedData(res.education);
    } catch (err) {
      setState({ loading: false, error: err, data: null });
    }
  };

  React.useEffect(() => {
    fetchEducationLevel();
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
              fetchEducationLevel();
            }
          }}
        />
        <div className="wrap">
          <br />
          <div className="flex jcsb ci">
            <h2>Education</h2>
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
          <div className="flex">
            <h2 className="flex ci">
              <img className="in-icon" src="/svg/book-open.svg" alt="" />
              <p> Education</p>
            </h2>
          </div>
          <Link href="/statistics">
            <a>
              <ModifiedButton text="Graphical Statistics" type="primary" icon={<PieChartOutlined />} />
            </a>
          </Link>
        </div>
        <br />
        <h2>List of users by level</h2>
        <React.Fragment>
          <br />
          {["All", "Associates", "Bachelor", "Masters", "PhD", "Others"].map((item, index) => {
            return (
              <Tag color={selectedTag === item ? "blue" : "default"} key={index} style={{ cursor: "pointer" }} onClick={() => setSelectedTag(item)}>
                {item}
              </Tag>
            );
          })}
          <br />
          <br />
          <div className="flex jcsb ci">
            <div className="res-search">
              <Input.Search
                placeholder="Search Education"
                onSearch={(val) => {
                  fetchEducationLevel(val);
                }}
                allowClear
                onChange={(e) => {
                  if (!e.target.value) fetchEducationLevel();
                }}
              ></Input.Search>
            </div>
            <Pagination
              onChange={(val) => {
                fetchEducationLevel("", val);
              }}
              total={paginate.total}
              current={paginate.page}
              showSizeChanger
              pageSize={paginate.per_page}
              onShowSizeChange={(val, perPage) => {
                fetchEducationLevel("", val, perPage);
              }}
            />
          </div>
        </React.Fragment>
        <br />
        {state.loading && <Loading />}
        {state.error && <p style={{ color: "red" }}>{state.error.message || "Unusual error occured, try again"}</p>}
        {/* {state.data && state.data.length} */}
        {state.data && formattedData && formattedData.length > 0 && (
          <React.Fragment>
            <div className="contents-table">
              <table cellPadding="0" cellSpacing="0">
                <ContentTableHead onSort={levelSort} sortMode={sortLevel} onUniSort={uniSort} uniSortMode={sortUni} onNameSort={nameSort} nameSortMode={sortName} onMajorSort={majorSort} majorShortMode={sortMajor} />
                <tbody>
                  {formattedData.map((item, index) => {
                    return (
                      <ContentTableItems
                        viewProfile={(user) => {
                          setUserProfile(user);
                          setViewProfile(true);
                        }}
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

const ContentTableHead = ({ onSort, sortMode, nameSortMode, onNameSort, uniSortMode, onUniSort, onMajorSort, majorShortMode }) => {
  return (
    <thead>
      <tr>
        <th style={{ maxWidth: "40px" }}>SN</th>
        <th style={{ cursor: "pointer" }} onClick={() => onNameSort()}>
          Name
          {nameSortMode ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </th>
        <th style={{ cursor: "pointer" }} onClick={() => onMajorSort()}>
          Major {majorShortMode ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </th>
        <th style={{ cursor: "pointer" }} onClick={() => onSort()}>
          Level {sortMode ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </th>
        <th style={{ cursor: "pointer" }} onClick={() => onUniSort()}>
          University {uniSortMode ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </th>
        <th>Graduated</th>
        <th>Year</th>
        <th>Mentor</th>
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
          <span>{props.name}</span>
        </p>
      </td>
      <td>
        <div>{(props.education && props.education.major) || "n/a"}</div>
      </td>
      <td>
        <div>{(props.education && props.education.level) || "n/a"}</div>
      </td>
      <td>
        <div>{(props.education && props.education.university) || "n/a"}</div>
      </td>
      <td>
        <div>{props.education && props.education.graduated ? <Tag color="success">Yes</Tag> : <Tag color="volcano">No</Tag>}</div>
      </td>
      <td>
        <div>{(props.education && props.education.graduation_year) || "n/a"}</div>
      </td>
      <td>
        <div>{props.education && props.education.become_mentor ? <Tag color="success">Yes</Tag> : <Tag color="volcano">No</Tag>}</div>
      </td>
      <td>
        <div>{props.email}</div>
        <div>{props.phone_number}</div>
      </td>
    </tr>
  );
};
