import React, {useState} from 'react';
import {Row, Divider} from 'antd';

import Inputs from './Inputs';
import Outputs from './Outputs';

function ThreePhaseSystem() {
  const [voltageValue, setVoltageValue] = useState({
    magnitude: '0',
    phase: '0',
  });
  const [ImpedanceLoadValue, setImpedanceLoadValue] = useState({
    magnitude: '0',
    phase: '0',
  });
  const [ImpedanceTRValue, setImpedanceTRValue] = useState({
    magnitude: '0',
    phase: '0',
  });
  const [sourceShape, setSourceShape] = useState('Star');
  const [loadShape, setLoadShape] = useState('Star');

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
          sourceShape={sourceShape}
          setSourceShape={setSourceShape}
          loadShape={loadShape}
          setLoadShape={setLoadShape}
        />
      </Row>
      <Divider className="Divider">Output</Divider>
      <Row className="Outputs">
        <Outputs
          voltageValue={voltageValue}
          ImpedanceTRValue={ImpedanceTRValue}
          ImpedanceLoadValue={ImpedanceLoadValue}
          connection={sourceShape + loadShape}
          system={`${sourceShape}_${loadShape}`}
        />
      </Row>
    </div>
  );
}

export default ThreePhaseSystem;
