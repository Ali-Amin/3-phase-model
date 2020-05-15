import React, { useState } from "react";
import { Row } from "antd";

import Inputs from "./Inputs";

function ThreePhaseSystem() {
  const [voltageValue, setVoltageValue] = useState({
    magnitude: "0",
    phase: "0",
  });
  const [ImpedanceLoadValue, setImpedanceLoadValue] = useState({
    magnitude: "0",
    phase: "0",
  });
  const [ImpedanceTRValue, setImpedanceTRValue] = useState({
    magnitude: "0",
    phase: "0",
  });

  return (
    <div>
      <Row className="App">
        <h1>Three phase system</h1>
      </Row>
      <Row>
        <Inputs
          voltageValue={voltageValue}
          setVoltageValue={setVoltageValue}
          ImpedanceLoadValue={ImpedanceLoadValue}
          setImpedanceLoadValue={setImpedanceLoadValue}
          ImpedanceTRValue={ImpedanceTRValue}
          setImpedanceTRValue={setImpedanceTRValue}
        />
      </Row>
    </div>
  );
}

export default ThreePhaseSystem;
