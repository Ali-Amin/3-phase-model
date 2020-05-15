import React from "react";
import { Row } from "antd";

import systemAssets from "../assets";

function Outputs({ system }) {
  return (
    <div>
      <Row>
        <img src={systemAssets[system]} width={540} height={350} />
      </Row>
    </div>
  );
}

export default Outputs;
