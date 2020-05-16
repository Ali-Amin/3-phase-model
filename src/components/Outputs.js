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
  },
  tableRow: {
    textAlign: 'center',
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
      >
        <Row>
          <Col span={10}></Col>
          <Col span={7} style={styles.tableHeader}>
            SOURCE
          </Col>
          <Col span={7} style={styles.tableHeader}>
            LOAD
          </Col>
        </Row>
        {Object.keys(output.source).map((key) => {
          return (
            <Row key={key} style={styles.tableRow}>
              <Col span={10} style={styles.tableHeader}>
                {key}
              </Col>
              <Col span={7}>
                {output.source[key] !== null
                  ? `${output.source[key]?.magnitude.toFixed(
                      2
                    )} < ${output.source[key]?.phase.toFixed(2)}`
                  : '-'}
              </Col>
              <Col span={7}>
                {output.load[key] !== null
                  ? `${output.load[key]?.magnitude.toFixed(2)} < ${output.load[
                      key
                    ]?.phase.toFixed(2)}`
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
