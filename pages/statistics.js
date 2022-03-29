import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { execGetLevelStats, execGetAgeStats, execGetStateStats, execGetStateHometown } from "../api/apis";
import { Spin, Modal } from "antd";
import Link from "next/link";
import ModifiedButton from "../components/ModifiedButton";
import { BookOutlined } from "@ant-design/icons";
import UsMap from "../components/UsMap/UsMap";
import stateData from "../utils/usStateData";
import { DistrictMap } from "react-nepal-map";
import NepalMap from "../components/NepalMap.js/NepalMap";

const NepalMapPopCard = ({ cleanedData }) => {
  return (
    <div>
      <p>
        <b>District: </b> {cleanedData.name}
      </p>
      <p>
        <b>Province No: </b> {cleanedData.province}
      </p>
      <p>
        <b>Zip Coce: </b> {cleanedData.zip}
      </p>
      <p>
        <b>User count: </b> {cleanedData.user_count}
      </p>
    </div>
  );
};

export default function education_statistics() {
  const [level, setLevel] = React.useState({
    loading: false,
    error: false,
    data: null,
  });

  const [age, setAge] = React.useState({
    loading: false,
    error: false,
    data: null,
  });

  const [usState, setUsState] = React.useState({
    loading: false,
    error: false,
    data: null,
  });
  const [hometown, setHometown] = React.useState({
    loading: false,
    error: false,
    data: null,
  });

  const fetchHometown = async () => {
    setHometown({ loading: true, data: null, error: false });
    try {
      const res = await execGetStateHometown();
      console.log(res);
      setHometown({ loading: false, data: res, error: false });
    } catch (err) {
      console.log(err);
      setHometown({ loading: false, data: null, error: err });
    }
  };

  const fetchAge = async () => {
    setAge({ loading: true, data: null, error: false });
    try {
      const res = await execGetAgeStats();
      setAge({ loading: false, data: res, error: false });
    } catch (err) {
      setAge({ loading: false, data: null, error: err });
    }
  };

  const fetchLevel = async () => {
    setLevel({ loading: true, data: null, error: false });
    try {
      const res = await execGetLevelStats();
      setLevel({ loading: false, data: res, error: false });
    } catch (err) {
      setLevel({ loading: false, data: null, error: err });
    }
  };

  const fetchUsState = async () => {
    setUsState({ loading: true, data: null, error: false });
    try {
      const res = await execGetStateStats();
      setUsState({ loading: false, data: res, error: false });
    } catch (err) {
      setUsState({ loading: false, data: null, error: err });
    }
  };

  const doAlert = (data) => {
    if (!hometown.data) return;
    const district = data.name;

    console.log(district);

    const filterState = hometown.data.filter((item) => item.home_town == district);

    console.log(filterState);
    let user_count = 0;
    if (!filterState || filterState.length == 0) null;
    else {
      user_count = filterState[0].user_count;
    }

    Modal.info({
      title: " ",
      icon: null,
      content: <NepalMapPopCard cleanedData={{ ...data, user_count }} />,
      okButtonProps: { style: { background: "#8884d8", borderColor: "#8884d8" } },
    });
  };

  React.useEffect(() => {
    fetchLevel();
    fetchAge();
    fetchUsState();
    fetchHometown();
  }, []);

  return (
    <div className="wrap">
      <br />
      <div className="flex jcsb">
        <h2>
          <b>Statistics based on users</b>
        </h2>
        <Link href="/education">
          <a>
            <ModifiedButton text="Education Details" type="primary" icon={<BookOutlined />} />
          </a>
        </Link>
      </div>

      <br />
      <br />
      <div className="flex jcc">
        <h2>
          <b>User statistics based on state</b>
        </h2>
      </div>
      <br />
      <div className="map-container">
        {usState.loading && (
          <React.Fragment>
            <br />
            <div className="flex jcc">
              <Spin size="large"></Spin>
            </div>
            <br />
          </React.Fragment>
        )}
        {usState.data && <UsMap apiData={usState.data} stateData={stateData} />}
      </div>

      <br />
      <br />
      <br />
      <div className="flex jcc">
        <h2>
          <b>User statistics based on hometown </b>
        </h2>
      </div>
      <br />
      {hometown.loading && (
        <React.Fragment>
          <br />
          <div className="flex jcc">
            <Spin size="large"></Spin>
          </div>
          <br />
        </React.Fragment>
      )}
      {hometown.data && (
        <div className="flex jcc">
          <div style={{ width: 500, maxWidth: "100%" }}>
            {/* <DistrictMap hoverColor="red" onMapClick={(res) => doAlert(res)} /> */}
            <NepalMap hometown={hometown.data} />
          </div>
        </div>
      )}

      <br />
      <div className="chart-container">
        <aside>
          <br />
          <h2 style={{ textAlign: "center" }}>
            <b>User statistics based on education level</b>
          </h2>
          <br />
          {level.loading && (
            <React.Fragment>
              <br />
              <Spin size="large"></Spin>
              <br />
            </React.Fragment>
          )}
          {level.data && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={level.data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: "Education Level", position: "insideBottom", dy: 10 }} />
                <YAxis label={{ value: "No of users", position: "insideLeft", angle: -90, dy: -10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </aside>
        <aside>
          <br />
          <h2 style={{ textAlign: "center" }}>
            <b>User statistics based on age group</b>
          </h2>
          <br />
          {age.loading && (
            <React.Fragment>
              <br />
              <Spin size="large"></Spin>
              <br />
            </React.Fragment>
          )}
          {age.data && (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie data={age.data} cx="50%" cy="50%" label={renderCustomizedLabel} outerRadius={100} fill="#8884d8" dataKey="value">
                  {data01.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor()} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </aside>
      </div>
    </div>
  );
}

const renderCustomizedLabel = ({ value, x, y, textAnchor }) => {
  return (
    <text x={x} y={y} fill="#000" alignmentBaseline="middle" textAnchor={textAnchor}>
      <tspan x={x} dy="0em">
        {value}
      </tspan>
    </text>
  );
};

const getColor = () => {
  return "#" + Math.random().toString(16).slice(-6);
};

const data01 = [
  {
    name: "Below 20",
    value: 400,
  },
  {
    name: "20-25",
    value: 300,
  },
  {
    name: "25-30",
    value: 300,
  },
  {
    name: "30-40",
    value: 200,
  },
  {
    name: "40-50",
    value: 278,
  },
  {
    name: "50-60",
    value: 189,
  },
  {
    name: "Above 60",
    value: 99,
  },
];
