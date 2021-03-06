import React, {useState, useEffect} from 'react';
import {Row, Col, Select, Input} from 'antd';

const {Option} = Select;

function Inputs({
  ImpedanceLoadValue,
  setImpedanceLoadValue,
  voltageValue,
  setVoltageValue,
  setImpedanceTRValue,
  ImpedanceTRValue,
  sourceShape,
  loadShape,
  setSourceShape,
  setLoadShape,
}) {
  const [vType, setVType] = useState('line');

  function onChangeVoltage(value, key) {
    switch (key) {
      case 'magnitude':
        setVoltageValue((prev) => {
          return {...prev, magnitude: value};
        });
        break;
      default:
        setVoltageValue((prev) => {
          return {...prev, phase: value};
        });
        break;
    }
  }
  function onChangeLoad(value, key) {
    switch (key) {
      case 'magnitude':
        setImpedanceLoadValue((prev) => {
          return {...prev, magnitude: value};
        });
        break;
      default:
        setImpedanceLoadValue((prev) => {
          return {...prev, phase: value};
        });
        break;
    }
  }
  function onChangeImpedanceTR(value, key) {
    if (parseFloat(value) == value || value === '') {
      switch (key) {
        case 'magnitude':
          setImpedanceTRValue((prev) => {
            return {...prev, magnitude: value};
          });
          break;
        default:
          setImpedanceTRValue((prev) => {
            return {...prev, phase: value};
          });
          break;
      }
    }
  }

  useEffect(() => {
    switch (sourceShape) {
      case 'Star':
        setVType('Phase');
        break;

      default:
        setVType('line');
        break;
    }
  }, [sourceShape]);
  return (
    <div>
      <Row gutter={[16, 24]}>
        <Col span={12}>
          <Select
            defaultValue={sourceShape}
            onChange={setSourceShape}
            className="selectShape"
          >
            <Option value="Delta">Delta</Option>
            <Option value="Star">Star</Option>
          </Select>
        </Col>
        <Col span={12}>
          <Select
            defaultValue={loadShape}
            onChange={setLoadShape}
            className="selectShape"
          >
            <Option value="Delta">Delta</Option>
            <Option value="Star">Star</Option>
          </Select>
        </Col>
      </Row>

      <Row gutter={[16, 24]}>
        <Col span={12}>
          <Row className="App">
            <h1>
              V<sub>{vType === 'line' ? 'ab' : 'an'}</sub>
            </h1>
          </Row>
          <Row style={{padding: '0px 10%'}}>
            <Input
              type="number"
              step={0.1}
              addonBefore="Magnitude"
              value={voltageValue.magnitude}
              onChange={(event) =>
                onChangeVoltage(event.target.value, 'magnitude')
              }
            />
            <Input
              type="number"
              step={0.1}
              addonBefore="Phase"
              value={voltageValue.phase}
              onChange={(event) => onChangeVoltage(event.target.value, 'phase')}
            />
          </Row>
        </Col>
        <Col span={12}>
          <Row className="App">
            <h1>
              Z<sub>{loadShape === 'Star' ? 'L' : 'Δ'}</sub>
            </h1>
          </Row>
          <Row style={{padding: '0px 10%'}}>
            <Input
              type="number"
              step={0.1}
              addonBefore="Magnitude"
              value={ImpedanceLoadValue.magnitude}
              onChange={(event) =>
                onChangeLoad(event.target.value, 'magnitude')
              }
            />
            <Input
              addonBefore="Phase"
              value={ImpedanceLoadValue.phase}
              onChange={(event) => onChangeLoad(event.target.value, 'phase')}
            />
          </Row>
        </Col>
      </Row>
      <Row className="App">
        <Col span={12}>
          <Row className="App">
            <h1>
              Z<sub>T</sub>
            </h1>
          </Row>
          <Row style={{padding: '0px 10%'}}>
            <Input
              type="number"
              step={0.1}
              addonBefore="Magnitude"
              value={ImpedanceTRValue.magnitude}
              onChange={(event) =>
                onChangeImpedanceTR(event.target.value, 'magnitude')
              }
            />
            <Input
              addonBefore="Phase"
              value={ImpedanceTRValue.phase}
              onChange={(event) =>
                onChangeImpedanceTR(event.target.value, 'phase')
              }
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Inputs;
