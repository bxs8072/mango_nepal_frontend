import React from "react";
import { Modal } from "antd";
import { colorIntensity } from "../../utils/helpers";
import districtMapData from "./data";

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

const countTotal = (data) => {
  let total = 0;
  data.forEach((item) => {
    total += item.user_count;
  });
  return total;
};

export default function NepalMap({ hometown }) {
  const getStateDataFromApi = (district, item) => {
    if (!hometown) return;

    const filterState = hometown.filter((item) => item.home_town == district);

    let user_count = 0;
    if (!filterState || filterState.length == 0) null;
    else {
      user_count = filterState[0].user_count;
    }

    Modal.info({
      title: " ",
      icon: null,
      content: <NepalMapPopCard cleanedData={{ ...item, user_count }} />,
      okButtonProps: { style: { background: "#8884d8", borderColor: "#8884d8" } },
    });
  };

  const total_user = countTotal(hometown);

  const getUserPercent = (state) => {
    const filterState = hometown.filter((item) => item.home_town == state);
    let user_count = 0;
    if (!filterState || filterState.length == 0) "";
    else {
      user_count = filterState[0].user_count;
    }
    return user_count / total_user;
  };

  return (
    <svg viewBox="0 0 1026.077 519.136">
      <g transform="translate(-52.379 -15.971)">
        {districtMapData.map((item, index) => {
          const userPercent = getUserPercent(item.name);
          const color = userPercent == 0 ? "#ddd" : colorIntensity("#a4b5d1", -getUserPercent(item.name));
          return (
            <path
              className="state-shape-path"
              style={{ cursor: "pointer", fill: color }}
              onClick={() => getStateDataFromApi(item.name, item)}
              key={index}
              stroke="#fff"
              strokeWidth="2px"
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
      </g>
    </svg>
  );
}
