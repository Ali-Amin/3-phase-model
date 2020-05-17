import React, { useState,useEffect } from "react";
import { Row, Button, Modal,Col } from "antd";
import * as circuitSolver from "../helpers/circuitSolver";
import * as convertComplex from "../helpers/convertComplex";

import systems from "../assets";

const styles = {
  tableHeader: {
    backgroundColor: 'grey',
    color: 'white',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableRow: {
    textAlign: 'center',
    fontSize: '18px',
  },
  vSeparator: {
    backgroundColor: 'grey',
    height: '95px',
    width: '2px',
  },
};

function Outputs({
  system,
  voltageValue,
  ImpedanceTRValue,
  ImpedanceLoadValue,
  connection,
}) {
  const [visible, setVisible] = useState(false);
  const [output, setOutput] = useState({source: {}, load: {}});
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (
      parseFloat(voltageValue.magnitude) !== 0 &&
      parseFloat(ImpedanceLoadValue.magnitude) !== 0
    )
      setButtonDisabled(false);
  }, [voltageValue, ImpedanceLoadValue]);

  const handleComputeClick = () => {
    const transmissionImpedance = convertComplex.phasorToCartesian({
      magnitude: parseFloat(ImpedanceTRValue.magnitude),
      phase: parseFloat(ImpedanceTRValue.phase),
    });

    const loadImpedance = convertComplex.phasorToCartesian({
      magnitude: parseFloat(ImpedanceLoadValue.magnitude),
      phase: parseFloat(ImpedanceLoadValue.phase),
    });

    let newOutput;

    switch (connection) {
      case 'StarStar':
        newOutput = circuitSolver.starStar({
          sourceMag: parseFloat(voltageValue.magnitude),
          sourcePhase: parseFloat(voltageValue.phase),
          transmissionReal: transmissionImpedance.real,
          transmissionImag: transmissionImpedance.imaginary,
          loadReal: loadImpedance.real,
          loadImag: loadImpedance.imaginary,
        });
        break;

      case "DeltaStar":
        newOutput = circuitSolver.deltaStar({
          voltageMagnitude: parseFloat(voltageValue.magnitude),
          voltagePhase: parseFloat(voltageValue.phase),
          realZL: loadImpedance.real,
          imagZL: loadImpedance.imaginary,
          realZT: transmissionImpedance.real,
          imagZT: transmissionImpedance.imaginary,
        });
        break;

      case 'StarDelta':
        newOutput = circuitSolver.starDelta({
          phaseVoltageMagnitude: parseFloat(voltageValue.magnitude),
          phaseVoltageAngle: parseFloat(voltageValue.phase),
          transReal: transmissionImpedance.real,
          transImag: transmissionImpedance.imaginary,
          loadReal: loadImpedance.real,
          loadImag: loadImpedance.imaginary,
        });
        break;

      case 'DeltaDelta':
        newOutput = circuitSolver.deltaDelta({
          lineVoltageMagnitude: parseFloat(voltageValue.magnitude),
          lineVoltagePhase: parseFloat(voltageValue.phase),
          transImpReal: transmissionImpedance.real,
          transImpImag: transmissionImpedance.imaginary,
          loadImpReal: loadImpedance.real,
          loadImpImag: loadImpedance.imaginary,
        });
        break;

      default:
        break;
    }

    console.log(output);
    setOutput(newOutput);
    setVisible(true);
    return;
  };

  return (
    <div>
      <Row>
        <img alt="" src={systems[system]} width={540} height={350} />
      </Row>
      <Row
        align="middle"
        justify="center"
        style={{
          marginTop: "20px",
        }}
      >
        <Button disabled={buttonDisabled} onClick={() => handleComputeClick()}>
          COMPUTE
        </Button>
      </Row>

      <Modal
        title="Results"
        visible={visible}
        onOk={() => setVisible(false)}
        closable={false}
        width={900}
      >
        <Row justify="center" align="middle" style={styles.tableRow}>
          <Col span={7}></Col>
          <Col span={8} style={styles.tableHeader}>
            SOURCE
          </Col>
          <Col span={8} style={styles.tableHeader}>
            LOAD
          </Col>
        </Row>
        {Object.keys(output.source).map((key) => {
          return (
            <Row
              key={key}
              justify="center"
              align="middle"
              style={styles.tableRow}
            >
              <Col
                span={7}
                style={Object.assign({height: '95px'}, styles.tableHeader)}
              >
                {key}
              </Col>
              <Col span={8}>
                {output.source[key] !== null && output.source[key] !== undefined
                  ? Object.keys(output.source[key]).map((val) => {
                      const symbols = val.split('_');
                      return (
                        <div>
                          <span>{symbols[0]}</span>
                          <span>
                            <sub>{symbols[1]}</sub>
                          </span>
                          <span>{` = ${output.source[key][
                            val
                          ]?.magnitude.toFixed(2)} < ${output.source[key][
                            val
                          ]?.phase.toFixed(2)}`}</span>
                        </div>
                      );
                    })
                  : '-'}
              </Col>
              <Col style={styles.vSeparator}></Col>
              <Col span={8}>
                {output.load[key] !== null && output.load[key] !== undefined
                  ? Object.keys(output.load[key]).map((val) => {
                      const symbols = val.split('_');
                      return (
                        <div>
                          <span>{symbols[0]}</span>
                          <span>
                            <sub>{symbols[1]}</sub>
                          </span>
                          <span>{` = ${output.load[key][val]?.magnitude.toFixed(
                            2
                          )} < ${output.load[key][val]?.phase.toFixed(
                            2
                          )}`}</span>
                        </div>
                      );
                    })
                  : '-'}
              </Col>
            </Row>
          );
        })}
      </Modal>
    </div>
  );
}

export default Outputs;
