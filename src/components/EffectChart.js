import React, { useState, useEffect } from "react";
import { Row, Slider, Button, Modal, Select, Col } from "antd";
import { Bar } from "react-chartjs-2";

import handleComputeData from "../helpers/handleComputeData";
import formatInputChart from "../helpers/formatInputChart";
import formatOutputChart from "../helpers/formatOutputChart";

const { Option } = Select;

function EffectChart({
  voltageValue,
  ImpedanceTRValue,
  ImpedanceLoadValue,
  connection,
}) {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [input, setInput] = useState("v_magnitude");
  const [effectOn, setEffectOn] = useState("Line Current");
  const [range, setRange] = useState([20, 50]);
  const [effectOnKey, setEffectOnKey] = useState("load");
  const [data, setData] = useState({ labels: [], datasets: [] });
  const generateRange = () => {
    setIsGenerateModalOpen(true);
  };

  useEffect(() => {
    let inputs = {
      ImpedanceLoadValue,
      ImpedanceTRValue,
      voltageValue,
      connection,
    };
    let labels = [...Array(101).keys()].slice(range[0], range[1]);
    let OutputMagnitude = [];
    let outputPhase = [];
    labels.forEach((element) => {
      let result = formatOutputChart({
        effectOn,
        effectOnKey,
        output: handleComputeData(
          formatInputChart({ inputs, value: element, key: input })
        ),
      });

      OutputMagnitude.push(result.magnitude);
      outputPhase.push(result.phase);
    });
    setData({
      labels: labels,
      datasets: [
        {
          label: `${effectOn} VALUES`,
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: OutputMagnitude,
        },
        {
          label: `${effectOn} Phase`,
          backgroundColor: "rgba(74,81,132,0.2)",
          borderColor: "rgba(74,81,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(74,81,132,0.4)",
          hoverBorderColor: "rgba(74,81,132,1)",
          data: OutputMagnitude,
        },
      ],
    });
  }, [range, input, effectOn,effectOnKey]);
  return (
    <div>
      <Button
        disabled={
          parseFloat(voltageValue.magnitude) === 0 ||
          parseFloat(ImpedanceLoadValue.magnitude) === 0
        }
        onClick={() => generateRange()}
      >
        Generate Range
      </Button>
      <Modal
        title="Generate Modal"
        visible={isGenerateModalOpen}
        onOk={() => setIsGenerateModalOpen(false)}
        onCancel={() => setIsGenerateModalOpen(false)}
        width={"50%"}
      >
        <Row gutter={[15, 16]} align="middle">
          <Col>
            {" "}
            <h3>Effect of</h3>{" "}
          </Col>
          <Col>
            <Select
              defaultValue={input}
              onChange={setInput}
              className="selectShape"
              style={{ width: "150px" }}
            >
              <Option value="v_magnitude">V magnitude</Option>
              <Option value="v_phase">V Phase</Option>
              <Option value="z_load_magnitude">Z load magnitude</Option>
              <Option value="z_load_phase">Z load Phase</Option>
              <Option value="z_tl_magnitude">Z transmission magnitude</Option>
              <Option value="z_tl_phase">Z transmission Phase</Option>
            </Select>
          </Col>
        </Row>

        <Row gutter={[15, 15]} align="middle">
          <Col>
            {" "}
            <h3>On </h3>{" "}
          </Col>
          <Col>
            <Select
              defaultValue={effectOnKey}
              onChange={setEffectOnKey}
              className="selectShape"
              style={{ width: "100px" }}
            >
              <Option value="load">Load</Option>
              <Option value="source">Source</Option>
            </Select>
          </Col>
          <Col>
            <Select
              defaultValue={effectOn}
              onChange={setEffectOn}
              className="selectShape"
              style={{ width: "250px" }}
            >
              <Option value="Line Current">Line Current</Option>
              <Option value="Phase Current">Phase Current</Option>
              <Option value="Line Voltage">Line Voltage</Option>
              <Option value="Phase Voltage">Phase Voltage</Option>
              <Option value="Single Phase Apparent Power">
                Apparent Power Single phase
              </Option>
              <Option value="Three Phase Apparent Power">
                Apparent Power Three phase
              </Option>
            </Select>
          </Col>
        </Row>

        <Slider range defaultValue={range} onChange={setRange} />
        <Bar data={data} />
      </Modal>
    </div>
  );
}

export default EffectChart;
