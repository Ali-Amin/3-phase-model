import React, {useState} from 'react';
import {Row, Button, Modal} from 'antd';
import * as circuitSolver from '../helpers/circuitSolver';
import * as convertComplex from '../helpers/convertComplex';

import systems from '../assets';

function Outputs({
  system,
  voltageValue,
  ImpedanceTRValue,
  ImpedanceLoadValue,
  connection,
}) {
  const [visible, setVisible] = useState(false);
  const [output, setOutput] = useState({});

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
        newOutput = circuitSolver.starStarSolver({
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
        newOutput = circuitSolver.solveStarDelta({
          phaseVoltageMagnitude: eval(voltageValue.magnitude),
          phaseVoltageAngle: eval(voltageValue.phase),
          transReal: transmissionImpedance.real,
          transImag: transmissionImpedance.imaginary,
          loadReal: loadImpedance.real,
          loadImag: loadImpedance.imaginary,
        });
        break;

      default:
        break;
    }

    console.log(output);
    setVisible(true);
    setOutput(newOutput);
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
        <p>{JSON.stringify(output)}</p>
      </Modal>
    </div>
  );
}

export default Outputs;
