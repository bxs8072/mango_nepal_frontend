import React from "react";
import { Modal } from "antd";
import { colorIntensity } from "../../utils/helpers";

const UsPopCard = ({ state, user_count }) => {
  return (
    <div>
      <p>
        <b>State: </b> {state}
      </p>
      <p>
        <b>User Count: </b> {user_count}
      </p>
    </div>
  );
};

const countTotal = (data) => {
  let total = 0;
  data.forEach((item) => {
    total += item.user_count;
  });
  return total;
};

export default function UsMap({ stateData, apiData }) {
  const getStateDataFromApi = (state) => {
    const filterState = apiData.filter((item) => item.state == state);
    let user_count = 0;
    if (!filterState || filterState.length == 0) console.error("No state data found");
    else {
      user_count = filterState[0].user_count;
    }

    Modal.info({
      title: " ",
      icon: null,
      content: <UsPopCard state={state} user_count={user_count} />,
      okButtonProps: { style: { background: "#8884d8", borderColor: "#8884d8" } },
    });
  };

  const total_user = countTotal(apiData);

  const getUserPercent = (state) => {
    const filterState = apiData.filter((item) => item.state == state);
    let user_count = 0;
    if (!filterState || filterState.length == 0) "";
    else {
      user_count = filterState[0].user_count;
    }

    return user_count / total_user;
  };

  return (
    <svg viewBox="0 0 960 600">
      {stateData.map((item, index) => {
        const userPercent = getUserPercent(item.id);

        const color = userPercent == 0 ? "#ddd" : colorIntensity("#a4b5d1", -getUserPercent(item.id));
        return (
          <path
            className="state-shape-path"
            style={{ cursor: "pointer", fill: color }}
            onClick={() => getStateDataFromApi(item.id)}
            key={index}
            stroke="#fff"
            strokeWidth="6px"
            d={item.shape}
            onMouseOver={(event) => {
              event.target.style.fill = "#f73a19";
            }}
            onMouseOut={(event) => {
              event.target.style.fill = color;
            }}
          ></path>
        );
      })}
    </svg>
  );
}
