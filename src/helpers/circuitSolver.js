import * as convertComplex from './convertComplex';
import * as complexOperations from './complexOperations';

export function starStar({
  sourceMag,
  sourcePhase,
  transmissionReal,
  transmissionImag,
  loadReal,
  loadImag,
}) {
  //total impedance calc
  const totalImpedanceCartesian = complexOperations.addComplex ({
    real1: transmissionReal,
    imag1: transmissionImag,
    real2: loadReal,
    imag2: loadImag,
  });

  const totalImpedancePolar = convertComplex.cartesianToPhasor (
    totalImpedanceCartesian
  );

  //current clac
  //line == phase
  const lineCurrentPhasor = complexOperations.divisionPhasor ({
    magnitude1: sourceMag,
    phase1: sourcePhase,
    magnitude2: totalImpedancePolar.magnitude,
    phase2: totalImpedancePolar.phase,
  });

  //voltage calc
  const sourcePhaseVoltagePhasor = {
    magnitude: sourceMag,
    phase: sourcePhase,
  };

  const sourceLineVoltagePhasor = {
    magnitude: Math.sqrt (3) * sourceMag,
    phase: sourcePhase + 30,
  };

  const loadImpedancePhasor = convertComplex.cartesianToPhasor ({
    real: loadReal,
    imaginary: loadImag,
  });
  const loadPhaseVoltagePhasor = complexOperations.multiplicationPhasor ({
    magnitude1: lineCurrentPhasor.magnitude,
    phase1: lineCurrentPhasor.phase,
    magnitude2: loadImpedancePhasor.magnitude,
    phase2: loadImpedancePhasor.phase,
  });

  const loadLineVoltagePhasor = {
    magnitude: Math.sqrt (3) * loadPhaseVoltagePhasor.magnitude,
    phase: loadPhaseVoltagePhasor.phase + 30,
  };

  //output power calc
  const singlePhaseLoadActivePower =
    Math.pow (lineCurrentPhasor.magnitude, 2) * loadReal;
  const singlePhaseLoadReactivePower =
    Math.pow (lineCurrentPhasor.magnitude, 2) * loadImag;
  const singlePhaseLoadApparentPower = convertComplex.cartesianToPhasor ({
    real: singlePhaseLoadActivePower,
    imaginary: singlePhaseLoadReactivePower,
  });
  const threePhaseLoadApparentPower = {
    magnitude: 3 * singlePhaseLoadApparentPower.magnitude,
    phase: singlePhaseLoadApparentPower.phase,
  };

  //total power calc
  const singlePhaseTotalActivePower =
    Math.pow (lineCurrentPhasor.magnitude, 2) * totalImpedanceCartesian.real;
  const singlePhaseTotalReactivePower =
    Math.pow (lineCurrentPhasor.magnitude, 2) *
    totalImpedanceCartesian.imaginary;
  const singlePhaseTotalApparentPower = convertComplex.cartesianToPhasor ({
    real: singlePhaseTotalActivePower,
    imaginary: singlePhaseTotalReactivePower,
  });
  const threePhaseTotalApparentPower = {
    magnitude: 3 * singlePhaseTotalApparentPower.magnitude,
    phase: singlePhaseTotalApparentPower.phase,
  };

  return {
    source: {
      'Line Current': {
        I_aA: lineCurrentPhasor,
        I_bB: {
          magnitude: lineCurrentPhasor.magnitude,
          phase: lineCurrentPhasor.phase - 120,
        },
        I_cC: {
          magnitude: lineCurrentPhasor.magnitude,
          phase: lineCurrentPhasor.phase + 120,
        },
      },
      'Phase Current': {
        I_na: lineCurrentPhasor,
        I_nb: {
          magnitude: lineCurrentPhasor.magnitude,
          phase: lineCurrentPhasor.phase - 120,
        },
        I_nc: {
          magnitude: lineCurrentPhasor.magnitude,
          phase: lineCurrentPhasor.phase + 120,
        },
      },
      'Line Voltage': {
        V_ab: sourceLineVoltagePhasor,
        V_bc: {
          magnitude: sourceLineVoltagePhasor.magnitude,
          phase: sourceLineVoltagePhasor.phase - 120,
        },
        V_ca: {
          magnitude: sourceLineVoltagePhasor.magnitude,
          phase: sourceLineVoltagePhasor.phase + 120,
        },
      },
      'Phase Voltage': {
        V_an: sourcePhaseVoltagePhasor,
        V_bn: {
          magnitude: sourcePhaseVoltagePhasor.magnitude,
          phase: sourcePhaseVoltagePhasor.phase - 120,
        },
        V_cn: {
          magnitude: sourcePhaseVoltagePhasor.magnitude,
          phase: sourcePhaseVoltagePhasor.phase + 120,
        },
      },
      'Single Phase Apparent Power': {
        S_1: singlePhaseTotalApparentPower,
      },
      'Three Phase Apparent Power': {
        S_3: threePhaseTotalApparentPower,
      },
    },
    load: {
      'Line Current': {
        I_aA: lineCurrentPhasor,
        I_bB: {
          magnitude: lineCurrentPhasor.magnitude,
          phase: lineCurrentPhasor.phase - 120,
        },
        I_cC: {
          magnitude: lineCurrentPhasor.magnitude,
          phase: lineCurrentPhasor.phase + 120,
        },
      },
      'Phase Current': {
        I_An: lineCurrentPhasor,
        I_Bn: {
          magnitude: lineCurrentPhasor.magnitude,
          phase: lineCurrentPhasor.phase - 120,
        },
        I_Cn: {
          magnitude: lineCurrentPhasor.magnitude,
          phase: lineCurrentPhasor.phase + 120,
        },
      },
      'Line Voltage': {
        V_AB: loadLineVoltagePhasor,
        V_BC: {
          magnitude: loadLineVoltagePhasor.magnitude,
          phase: loadLineVoltagePhasor.phase - 120,
        },
        V_CA: {
          magnitude: loadLineVoltagePhasor.magnitude,
          phase: loadLineVoltagePhasor.phase + 120,
        },
      },
      'Phase Voltage': {
        V_An: loadPhaseVoltagePhasor,
        V_Bn: {
          magnitude: loadPhaseVoltagePhasor.magnitude,
          phase: loadPhaseVoltagePhasor.phase - 120,
        },
        V_Cn: {
          magnitude: loadPhaseVoltagePhasor.magnitude,
          phase: loadPhaseVoltagePhasor.phase + 120,
        },
      },
      'Single Phase Apparent Power': {
        S_1: singlePhaseLoadApparentPower,
      },
      'Three Phase Apparent Power': {
        S_3: threePhaseLoadApparentPower,
      },
    },
  };
}

export function starDelta({
  phaseVoltageMagnitude,
  phaseVoltageAngle,
  transReal,
  transImag,
  loadReal,
  loadImag,
}) {
  const sourceLineVoltage = {
    magnitude: phaseVoltageMagnitude * Math.sqrt (3),
    phase: phaseVoltageAngle + 30,
  };

  const eqImpComplex = complexOperations.addComplex ({
    real1: transReal,
    imag1: transImag,
    real2: loadReal / 3,
    imag2: loadImag / 3,
  });
  const eqImpPhasor = convertComplex.cartesianToPhasor ({
    real: eqImpComplex.real,
    imaginary: eqImpComplex.imaginary,
  });

  const lineCurrent = complexOperations.divisionPhasor ({
    magnitude1: phaseVoltageMagnitude,
    phase1: phaseVoltageAngle,
    magnitude2: eqImpPhasor.magnitude,
    phase2: eqImpPhasor.phase,
  });

  const phaseCurrent = {
    magnitude: lineCurrent.magnitude / Math.sqrt (3),
    phase: lineCurrent.phase + 30,
  };

  const loadImpPhasor = convertComplex.cartesianToPhasor ({
    real: loadReal,
    imaginary: loadImag,
  });
  const loadLineVoltage = complexOperations.multiplicationPhasor ({
    magnitude1: phaseCurrent.magnitude,
    phase1: phaseCurrent.phase,
    magnitude2: loadImpPhasor.magnitude,
    phase2: loadImpPhasor.phase,
  });

  const singlePhaseLoadActivePower =
    Math.pow (phaseCurrent.magnitude, 2) * loadReal;
  const singlePhaseLoadReactivePower =
    Math.pow (phaseCurrent.magnitude, 2) * loadImag;

  const singlePhaseLoadApparentPower = convertComplex.cartesianToPhasor ({
    real: singlePhaseLoadActivePower,
    imaginary: singlePhaseLoadReactivePower,
  });

  const threePhaseLoadActivePower = {
    magnitude: singlePhaseLoadApparentPower.magnitude * 3,
    phase: singlePhaseLoadApparentPower.phase,
  };

  const singlePhaseTransActivePower =
    Math.pow (lineCurrent.magnitude, 2) * transReal;
  const singlePhaseTransReactivePower =
    Math.pow (lineCurrent.magnitude, 2) * transImag;
  const singlePhaseTotalApparentPower = convertComplex.cartesianToPhasor ({
    real: singlePhaseTransActivePower + singlePhaseLoadActivePower,
    imaginary: singlePhaseTransReactivePower + singlePhaseLoadReactivePower,
  });

  const threePhaseTotalApparentPower = {
    magnitude: singlePhaseTotalApparentPower.magnitude * 3,
    phase: singlePhaseTotalApparentPower.phase,
  };
  return {
    source: {
      'Phase Voltage': {
        V_an: {
          magnitude: phaseVoltageMagnitude,
          phase: phaseVoltageAngle,
        },
        V_bn: {
          magnitude: phaseVoltageMagnitude,
          phase: phaseVoltageAngle - 120,
        },
        V_cn: {
          magnitude: phaseVoltageMagnitude,
          phase: phaseVoltageAngle + 120,
        },
      },
      'Line Voltage': {
        V_ab: sourceLineVoltage,
        V_bc: {
          magnitude: sourceLineVoltage.magnitude,
          phase: sourceLineVoltage.phase - 120,
        },
        V_ca: {
          magnitude: sourceLineVoltage.magnitude,
          phase: sourceLineVoltage.phase + 120,
        },
      },
      'Line Current': {
        I_aA: lineCurrent,
        I_bB: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase - 120,
        },
        I_cC: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase + 120,
        },
      },
      'Phase Current': {
        I_na: lineCurrent,
        I_nb: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase - 120,
        },
        I_nc: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase + 120,
        },
      },
      'Single Phase Apparent Power': {
        S_1: singlePhaseLoadApparentPower,
      },
      'Three Phase Apparent Power': {
        S_3: threePhaseLoadActivePower,
      },
    },
    load: {
      'Phase Voltage': {
        V_AB: loadLineVoltage,
        V_BC: {
          magnitude: loadLineVoltage.magnitude,
          phase: loadLineVoltage.phase - 120,
        },
        V_CA: {
          magnitude: loadLineVoltage.magnitude,
          phase: loadLineVoltage.phase + 120,
        },
      },
      'Line Voltage': {
        V_AB: loadLineVoltage,
        V_BC: {
          magnitude: loadLineVoltage.magnitude,
          phase: loadLineVoltage.phase - 120,
        },
        V_CA: {
          magnitude: loadLineVoltage.magnitude,
          phase: loadLineVoltage.phase + 120,
        },
      },
      'Line Current': {
        I_aA: lineCurrent,
        I_bB: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase - 120,
        },
        I_cC: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase + 120,
        },
      },
      'Phase Current': {
        I_AB: phaseCurrent,
        I_BC: {
          magnitude: phaseCurrent.magnitude,
          phase: phaseCurrent.phase - 120,
        },
        I_CA: {
          magnitude: phaseCurrent.magnitude,
          phase: phaseCurrent.phase + 120,
        },
      },
      'Single Phase Apparent Power': {
        S_1: singlePhaseTotalApparentPower,
      },
      'Three Phase Apparent Power': {
        S_3: threePhaseTotalApparentPower,
      },
    },
  };
}

export function deltaStar({
  voltageMagnitude,
  voltagePhase,
  realZT,
  imagZT,
  realZL,
  imagZL,
}) {
  const Zeq = complexOperations.addComplex ({
    real1: realZT,
    imag1: imagZT,
    real2: realZL,
    imag2: imagZL,
  });
  const phasorZeq = convertComplex.cartesianToPhasor ({
    real: Zeq.real,
    imaginary: Zeq.imaginary,
  });

  console.log (Zeq);
  const phaseVoltage = {
    magnitude: voltageMagnitude / Math.sqrt (3),
    phase: voltagePhase - 30,
  };
  const lineCurrent = complexOperations.divisionPhasor ({
    magnitude1: phaseVoltage.magnitude,
    phase1: phaseVoltage.phase,
    magnitude2: phasorZeq.magnitude,
    phase2: phasorZeq.phase,
  });
  const phasorLoad = convertComplex.cartesianToPhasor ({
    real: realZL,
    imaginary: imagZL,
  });
  const loadPhaseVoltage = complexOperations.multiplicationPhasor ({
    magnitude1: lineCurrent.magnitude,
    phase1: lineCurrent.phase,
    magnitude2: phasorLoad.magnitude,
    phase2: phasorLoad.phase,
  });
  const singlePhaseLoadActivePower =
    Math.pow (lineCurrent.magnitude, 2) * realZL;
  const singlePhaseLoadReactivePower =
    Math.pow (lineCurrent.magnitude, 2) * imagZL;
  const singlePhaseLoadApparentPower = convertComplex.cartesianToPhasor ({
    real: singlePhaseLoadActivePower,
    imaginary: singlePhaseLoadReactivePower,
  });
  const threePhaseLoadApparentPower = {
    magnitude: singlePhaseLoadApparentPower.magnitude * 3,
    phase: singlePhaseLoadApparentPower.phase,
  };
  const singlePhaseActivePower = Math.pow (lineCurrent.magnitude, 2) * Zeq.real;
  const singlePhaseReactivePower =
    Math.pow (lineCurrent.magnitude, 2) * Zeq.imaginary;
  const singlePhaseApparentPower = convertComplex.cartesianToPhasor ({
    real: singlePhaseActivePower,
    imaginary: singlePhaseReactivePower,
  });
  const threePhaseApparentPower = {
    magnitude: singlePhaseApparentPower.magnitude * 3,
    phase: singlePhaseApparentPower.phase,
  };
  return {
    source: {
      'Phase Voltage': {
        V_ab: {
          magnitude: voltageMagnitude,
          phase: voltagePhase,
        },
        V_bc: {
          magnitude: voltageMagnitude,
          phase: voltagePhase - 120,
        },
        V_ca: {
          magnitude: voltageMagnitude,
          phase: voltagePhase + 120,
        },
      },
      'Line Voltage': {
        V_ab: {
          magnitude: voltageMagnitude,
          phase: voltagePhase,
        },
        V_bc: {
          magnitude: voltageMagnitude,
          phase: voltagePhase - 120,
        },
        V_ca: {
          magnitude: voltageMagnitude,
          phase: voltagePhase + 120,
        },
      },
      'Line Current': null,
      'Phase Current': null,
      'Single Phase Apparent Power': {
        S_1: singlePhaseApparentPower,
      },
      'Three Phase Apparent Power': {
        S_3: threePhaseApparentPower,
      },
    },
    load: {
      'Line Current': {
        I_aA: lineCurrent,
        I_bB: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase - 120,
        },
        I_cC: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase + 120,
        },
      },
      'Phase Current': {
        I_An: lineCurrent,
        I_Bn: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase - 120,
        },
        I_Cn: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase + 120,
        },
      },
      'Phase Voltage': {
        V_An: loadPhaseVoltage,
        V_Bn: {
          magnitude: loadPhaseVoltage.magnitude,
          phase: loadPhaseVoltage.phase - 120,
        },
        V_Cn: {
          magnitude: loadPhaseVoltage.magnitude,
          phase: loadPhaseVoltage.phase + 120,
        },
      },
      'Single Phase Apparent Power': {
        S_1: singlePhaseLoadApparentPower,
      },
      'Three Phase Apparent Power': {
        S_3: threePhaseLoadApparentPower,
      },
    },
  };
}

export function deltaDelta({
  lineVoltageMagnitude,
  lineVoltagePhase,
  transImpReal,
  transImpImag,
  loadImpReal,
  loadImpImag,
}) {
  const phaseVoltage = {
    magnitude: lineVoltageMagnitude / Math.sqrt (3),
    phase: lineVoltagePhase - 30,
  };
  const totalImp = complexOperations.addComplex ({
    real1: loadImpReal / 3,
    imag1: loadImpImag / 3,
    real2: transImpReal,
    imag2: transImpImag,
  });

  const totalImpPhasor = convertComplex.cartesianToPhasor (totalImp);

  const lineCurrent = complexOperations.divisionPhasor ({
    magnitude1: phaseVoltage.magnitude,
    phase1: phaseVoltage.phase,
    magnitude2: totalImpPhasor.magnitude,
    phase2: totalImpPhasor.phase,
  });

  const phaseCurrent = {
    magnitude: lineCurrent.magnitude / Math.sqrt (3),
    phase: lineCurrent.phase + 30,
  };

  const loadImpPhasor = convertComplex.cartesianToPhasor ({
    real: loadImpReal,
    imaginary: loadImpImag,
  });
  const loadPhaseVoltage = complexOperations.multiplicationPhasor ({
    magnitude1: phaseCurrent.magnitude,
    phase1: phaseCurrent.phase,
    magnitude2: loadImpPhasor.magnitude,
    phase2: loadImpPhasor.phase,
  });

  const loadLineVoltage = {
    magnitude: loadPhaseVoltage.magnitude * Math.sqrt (3),
    phase: loadPhaseVoltage.phase + 30,
  };

  const singlePhaseLoadActivePower =
    Math.pow (phaseCurrent.magnitude, 2) * loadImpReal;
  const singlePhaseLoadReactivePower =
    Math.pow (phaseCurrent.magnitude, 2) * loadImpImag;
  const singlePhaseLoadApparentPower = convertComplex.cartesianToPhasor ({
    real: singlePhaseLoadActivePower,
    imaginary: singlePhaseLoadReactivePower,
  });
  const threePhaseLoadApparentPower = {
    magnitude: singlePhaseLoadApparentPower.magnitude * 3,
    phase: singlePhaseLoadApparentPower.phase,
  };

  const singlePhaseTransActivePower =
    Math.pow (lineCurrent.magnitude, 2) * transImpReal;
  const singlePhaseTransReactivePower =
    Math.pow (lineCurrent.magnitude, 2) * transImpImag;

  const singlePhaseTotalApparentPower = convertComplex.cartesianToPhasor ({
    real: singlePhaseLoadActivePower + singlePhaseTransActivePower,
    imaginary: singlePhaseLoadReactivePower + singlePhaseTransReactivePower,
  });
  const threePhaseTotalApparentPower = {
    magnitude: singlePhaseTotalApparentPower.magnitude * 3,
    phase: singlePhaseTotalApparentPower.phase,
  };

  return {
    source: {
      'Line Voltage': {
        V_ab: {
          magnitude: lineVoltageMagnitude,
          phase: lineVoltagePhase,
        },
        v_bc: {
          magnitude: lineVoltageMagnitude,
          phase: lineVoltagePhase - 120,
        },
        V_ca: {
          magnitude: lineVoltageMagnitude,
          phase: lineVoltagePhase + 120,
        },
      },
      'Phase Voltage': {
        V_ab: {
          magnitude: lineVoltageMagnitude,
          phase: lineVoltagePhase,
        },
        v_bc: {
          magnitude: lineVoltageMagnitude,
          phase: lineVoltagePhase - 120,
        },
        V_ca: {
          magnitude: lineVoltageMagnitude,
          phase: lineVoltagePhase + 120,
        },
      },
      'Line Current': {
        I_aA: lineCurrent,
        I_bB: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase - 120,
        },
        I_cC: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase + 120,
        },
      },
      'Phase Current': null,
      'Single Phase Apparent Power': {
        S_1: singlePhaseTotalApparentPower,
      },
      'Three Phase Apparent Power': {
        S_3: threePhaseTotalApparentPower,
      },
    },
    load: {
      'Phase Voltage': {
        V_AB: loadPhaseVoltage,
        V_BC: {
          magnitude: loadPhaseVoltage.magnitude,
          phase: loadPhaseVoltage.phase - 120,
        },
        V_CA: {
          magnitude: loadPhaseVoltage.magnitude,
          phase: loadPhaseVoltage.phase + 120,
        },
      },
      'Line Voltage': {
        V_AB: loadPhaseVoltage,
        V_BC: {
          magnitude: loadPhaseVoltage.magnitude,
          phase: loadPhaseVoltage.phase - 120,
        },
        V_CA: {
          magnitude: loadPhaseVoltage.magnitude,
          phase: loadPhaseVoltage.phase + 120,
        },
      },
      'Line Current': {
        I_aA: lineCurrent,
        I_bB: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase - 120,
        },
        I_cC: {
          magnitude: lineCurrent.magnitude,
          phase: lineCurrent.phase + 120,
        },
      },
      'Phase Current': {
        I_AB: phaseCurrent,
        I_BC: {
          magnitude: phaseCurrent.magnitude,
          phase: phaseCurrent.phase - 120,
        },
        I_CA: {
          magnitude: phaseCurrent.magnitude,
          phase: phaseCurrent.phase + 120,
        },
      },
      'Single Phase Apparent Power': {
        S_1: singlePhaseLoadApparentPower,
      },
      'Three Phase Apparent Power': {
        S_3: threePhaseLoadApparentPower,
      },
    },
  };
}
