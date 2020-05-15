import React, { useState, useEffect } from "react";
import { Row, Col, Select, Input } from "antd";

const { Option } = Select;

function Inputs({RValue,setRValue,voltageValue,setVoltageValue}) {
  const [sourceShape, setSourceShape] = useState("Delta");
  const [loadShape, setLoadShape] = useState("Star");
  const [vType, setVType] = useState("line");


  function onChangeVoltage(value, key) {
    if (parseInt(value) == value) {
      switch (key) {
        case "magnitude":
          setVoltageValue((prev) => {
            return { ...prev, magnitude: value };
          });
          break;
        default:
          setVoltageValue((prev) => {
            return { ...prev, phase: value };
          });
          break;
      }
    }
  }
  function onChangeLoad(value, key) {
    if (parseInt(value) == value) {
      switch (key) {
        case "magnitude":
          setRValue((prev) => {
            return { ...prev, magnitude: value };
          });
          break;
        default:
          setRValue((prev) => {
            return { ...prev, phase: value };
          });
          break;
      }
    }
  }
  useEffect(() => {
    switch (sourceShape) {
      case "Star":
        setVType("Phase");
        break;

      default:
        setVType("line");
        break;
    }
  }, [sourceShape]);
  return (
    <div>
      <Row gutter={[16, 24]}>
        <Col span={12}>
          <Select defaultValue={sourceShape} onChange={setSourceShape}>
            <Option value="Delta">Delta</Option>
            <Option value="Star">Star</Option>
          </Select>
        </Col>
        <Col span={12}>
          <Select defaultValue={loadShape} onChange={setLoadShape}>
            <Option value="Delta">Delta</Option>
            <Option value="Star">Star</Option>
          </Select>
        </Col>
      </Row>

      <Row gutter={[16, 24]}>
        <Col span={12}>
          <Row className="App">
            <h1> V {vType}</h1>
          </Row>
          <Row style={{ padding: "0px 10%" }}>
            <Input
              addonBefore="Magnitude"
              value={voltageValue.magnitude}
              onChange={(event) =>
                onChangeVoltage(event.target.value, "magnitude")
              }
            />
            <Input
              addonBefore="Phase"
              value={voltageValue.phase}
              onChange={(event) => onChangeVoltage(event.target.value, "phase")}
            />
          </Row>
        </Col>
        <Col span={12}>
          <Row className="App">
            <h1> R load</h1>
          </Row>
          <Row style={{ padding: "0px 10%" }}>
            <Input
              addonBefore="Magnitude"
              value={RValue.magnitude}
              onChange={(event) =>
                onChangeLoad(event.target.value, "magnitude")
              }
            />
            <Input
              addonBefore="Phase"
              value={RValue.phase}
              onChange={(event) => onChangeLoad(event.target.value, "phase")}
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Inputs;
