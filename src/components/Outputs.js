import React, {useState} from 'react';
import {Row} from 'antd';

import systems from '../assets';

function Outputs({system}) {
  return (
    <div>
      <Row>
        {console.log(system)}
        <img alt="" src={systems[system]} width={540} height={350} />
      </Row>
    </div>
  );
}

export default Outputs;
