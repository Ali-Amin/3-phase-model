import React, {useState} from 'react';
import {Row, Button, Modal, Col} from 'antd';
import * as circuitSolver from '../helpers/circuitSolver';
import * as convertComplex from '../helpers/convertComplex';
import systems from '../assets';

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
  },
  vSeparator: {
    backgroundColor: 'grey',
    height: '80px',
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

  const handleComputeClick = () => {
    const transmissionImpedance = convertComplex.phasorToCartesian({
      magnitude: eval(ImpedanceTRValue.magnitude),
      phase: eval(ImpedanceTRValue.phase),
    });

    const loadImpedance = convertComplex.phasorToCartesian({
      magnitude: eval(ImpedanceLoadValue.magnitude),
      phase: eval(ImpedanceLoadValue.phase),
    });

    let newOutput;

    switch (connection) {
      case 'StarStar':
        newOutput = circuitSolver.starStar({
          sourceMag: eval(voltageValue.magnitude),
          sourcePhase: eval(voltageValue.phase),
          transmissionReal: transmissionImpedance.real,
          transmissionImag: transmissionImpedance.imaginary,
          loadReal: loadImpedance.real,
          loadImag: loadImpedance.imaginary,
        });
        break;

      case 'DeltaStar':
        newOutput = circuitSolver.deltaStar({
          voltageMagnitude: eval(voltageValue.magnitude),
          voltagePhase: eval(voltageValue.phase),
          realZL: loadImpedance.real,
          imagZL: loadImpedance.imaginary,
          realZT: transmissionImpedance.real,
          imagZT: transmissionImpedance.imaginary,
        });
        break;

      case 'StarDelta':
        newOutput = circuitSolver.starDelta({
          phaseVoltageMagnitude: eval(voltageValue.magnitude),
          phaseVoltageAngle: eval(voltageValue.phase),
          transReal: transmissionImpedance.real,
          transImag: transmissionImpedance.imaginary,
          loadReal: loadImpedance.real,
          loadImag: loadImpedance.imaginary,
        });
        break;

      case 'DeltaDelta':
        newOutput = circuitSolver.deltaDelta({
          lineVoltageMagnitude: eval(voltageValue.magnitude),
          lineVoltagePhase: eval(voltageValue.phase),
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
        {console.log(system)}
        <img alt="" src={systems[system]} width={540} height={350} />
      </Row>
      <Row
        align="middle"
        justify="center"
        style={{
          marginTop: '20px',
        }}
      >
        <Button onClick={() => handleComputeClick()}>COMPUTE</Button>
      </Row>

      <Modal
        title="Results"
        visible={visible}
        onOk={() => setVisible(false)}
        closable={false}
        width={800}
      >
        <Row justify="center" align="middle" style={styles.tableRow}>
          <Col span={9}></Col>
          <Col span={7} style={styles.tableHeader}>
            SOURCE
          </Col>
          <Col span={7} style={styles.tableHeader}>
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
                span={9}
                style={Object.assign({height: '80px'}, styles.tableHeader)}
              >
                {key}
              </Col>
              <Col span={7}>
                {output.source[key] !== null && output.source[key] !== undefined
                  ? Object.keys(output.source[key]).map((val) => (
                      <div>{`${val} = ${output.source[key][
                        val
                      ]?.magnitude.toFixed(2)} < ${output.source[key][
                        val
                      ]?.phase.toFixed(2)}`}</div>
                    ))
                  : '-'}
              </Col>
              <Col style={styles.vSeparator}></Col>
              <Col span={7}>
                {output.load[key] !== null && output.load[key] !== undefined
                  ? Object.keys(output.load[key]).map((val) => (
                      <div>{`${val} = ${output.load[key][
                        val
                      ]?.magnitude.toFixed(2)} < ${output.load[key][
                        val
                      ]?.phase.toFixed(2)}`}</div>
                    ))
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
