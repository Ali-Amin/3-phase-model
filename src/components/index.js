import React, { useState } from "react";
import { Row, Col, Select, Input } from "antd";

import Inputs from "./Inputs";

const { Option } = Select;

function ThreePhaseSystem() {
  const [voltageValue, setVoltageValue] = useState({
    magnitude: "0",
    phase: "0",
  });
  const [RValue, setRValue] = useState({ magnitude: "0", phase: "0" });
  return (
    <div>
      <Row className="App">
        <h1>Three phase system</h1>
      </Row>
      <Row>
        <Inputs
          voltageValue={voltageValue}
          setVoltageValue={setVoltageValue}
          RValue={RValue}
          setRValue={setRValue}
        />
              {console.log("v", voltageValue, RValue)}

      </Row>
    </div>
  );
}

export default ThreePhaseSystem;
