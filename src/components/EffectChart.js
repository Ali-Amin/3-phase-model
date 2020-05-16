import React, { useState, useEffect } from "react";
import { Row, Slider, Button, Modal, Select, Col } from "antd";
import { Bar } from "react-chartjs-2";

import handleComputeData from "../helpers/handleComputeData";
import handleComputeClick from "../helpers/handleComputeData";

const { Option } = Select;

// const data = {
//   labels: ["January", "February", "March", "April", "May", "June", "July"],
//   datasets: [
//     {
//       label: "VOLTAGES VALUES",
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(255,99,132,0.4)",
//       hoverBorderColor: "rgba(255,99,132,1)",
//       data: [65, 59, 80, 81, 56, 55, 40],
//     },
//     {
//       label: "VOLTAGES Phase",
//       backgroundColor: "rgba(74,81,132,0.2)",
//       borderColor: "rgba(74,81,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(74,81,132,0.4)",
//       hoverBorderColor: "rgba(74,81,132,1)",
//       data: [65, 59, 80, 81, 56, 55, 40],
//     },
//   ],
// };

function EffectChart({
  voltageValue,
  ImpedanceTRValue,
  ImpedanceLoadValue,
  connection,
}) {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [input, setInput] = useState("v_magnitude");
  const [effectOn, setEffectOn] = useState("phaseVoltage");
  const [range, setRange] = useState([20, 50]);
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
    switch (input) {
      case "v_magnitude":
        labels.forEach((element) => {
          inputs.voltageValue.magnitude = element;
          let result = handleComputeClick(inputs);
          if (effectOn === "phaseVoltage") {
            OutputMagnitude.push(result?.source?.phaseVoltage?.magnitude);
            outputPhase.push(result?.source?.phaseVoltage?.phase);
          }
        });

        break;

      default:
        break;
    }
    setData({labels:labels,datasets:[{ label: `${effectOn} VALUES`,
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data:OutputMagnitude
        },{
            label:`${effectOn} Phase`,
              backgroundColor: "rgba(74,81,132,0.2)",
      borderColor: "rgba(74,81,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(74,81,132,0.4)",
      hoverBorderColor: "rgba(74,81,132,1)",
          data:OutputMagnitude
        }]})
  }, [range, input, effectOn]);
  return (
    <div>
      <Button onClick={() => generateRange()}>Generate Range</Button>
    {console.log(data)}
      <Modal
        title="Generate Modal"
        visible={isGenerateModalOpen}
        onOk={() => setIsGenerateModalOpen(false)}
        onCancel={() => setIsGenerateModalOpen(false)}
        width={"50%"}
      >
        <Row gutter={[15]} align="middle">
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

        <Row gutter={[15]} align="middle">
          <Col>
            {" "}
            <h3>On </h3>{" "}
          </Col>
          <Col>
            <Select
              defaultValue={effectOn}
              onChange={setEffectOn}
              className="selectShape"
              style={{ width: "150px" }}
            >
              <Option value="line_current">Line Current</Option>
              <Option value="phase_current">Phase Current</Option>
              <Option value="power">Power</Option>
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
