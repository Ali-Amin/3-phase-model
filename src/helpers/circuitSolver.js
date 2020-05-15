import * as convertComplex from './convertComplex';
import * as complexOperations from './complexOperations';

export function starStarSolver({
  sourceMag,
  sourcePhase,
  transmissionReal,
  transmissionImag,
  loadReal,
  loadImag,
}) {
  //total impedance calc
  const totalImpedanceCartesian = complexOperations.addComplex({
    real1: transmissionReal,
    imag1: transmissionImag,
    real2: loadReal,
    imag2: loadImag,
  });

  const totalImpedancePolar = convertComplex.cartesianToPhasor(
    totalImpedanceCartesian
  );

  //current clac
  //line == phase
  const lineCurrentPhasor = complexOperations.divisionPhasor({
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
    magnitude: Math.sqrt(3) * sourceMag,
    phase: sourcePhase + 30,
  };

  const loadImpedancePhasor = convertComplex.cartesianToPhasor({
    real: loadReal,
    imaginary: loadImag,
  });
  const loadPhaseVoltagePhasor = complexOperations.multiplicationPhasor({
    magnitude1: lineCurrentPhasor.magnitude,
    phase1: lineCurrentPhasor.phase,
    magnitude2: loadImpedancePhasor.magnitude,
    phase2: loadImpedancePhasor.phase,
  });

  //output power calc
  const singlePhaseLoadActivePower =
    Math.pow(lineCurrentPhasor.magnitude, 2) * loadReal;
  const singlePhaseLoadReactivePower =
    Math.pow(lineCurrentPhasor.magnitude, 2) * loadImag;
  const singlePhaseLoadApparentPower = convertComplex.cartesianToPhasor({
    real: singlePhaseLoadActivePower,
    imaginary: singlePhaseLoadReactivePower,
  });
  const threePhaseLoadApparentPower = {
    magnitude: 3 * singlePhaseLoadApparentPower.magnitude,
    phase: singlePhaseLoadApparentPower.phase,
  };

  //total power calc
  const singlePhaseTotalActivePower =
    Math.pow(lineCurrentPhasor.magnitude, 2) * totalImpedanceCartesian.real;
  const singlePhaseTotalReactivePower =
    Math.pow(lineCurrentPhasor.magnitude, 2) *
    totalImpedanceCartesian.imaginary;
  const singlePhaseTotalApparentPower = convertComplex.cartesianToPhasor({
    real: singlePhaseTotalActivePower,
    imaginary: singlePhaseTotalReactivePower,
  });
  const threePhaseTotalApparentPower = {
    magnitude: 3 * singlePhaseTotalApparentPower.magnitude,
    phase: singlePhaseTotalApparentPower.phase,
  };

  return {
    source: {
      lineCurrent: lineCurrentPhasor,
      phaseCurrent: lineCurrentPhasor,
      lineVoltage: sourceLineVoltagePhasor,
      phaseVoltage: sourcePhaseVoltagePhasor,
      singlePhaseApparentPower: singlePhaseTotalApparentPower,
      threePhaseApparentPower: threePhaseTotalApparentPower,
    },
    load: {
      lineCurrent: lineCurrentPhasor,
      phaseCurrent: lineCurrentPhasor,
      lineVoltage: null,
      phaseVoltage: loadPhaseVoltagePhasor,
      singlePhaseApparentPower: singlePhaseLoadApparentPower,
      threePhaseApparentPower: threePhaseLoadApparentPower,
    },
  };
}

export function solveStarDelta({
  phaseVoltageMagnitude,
  phaseVoltageAngle,
  transReal,
  transImag,
  loadReal,
  loadImag
}) {
  const sourceLineVoltage = {
    magnitude: phaseVoltageMagnitude * Math.sqrt(3),
    phase: phaseVoltageAngle + 30
  };


  const eqImpComplex = complexOperations.addComplex({
    real1: transReal,
    imag1: transImag,
    real2: loadReal / 3,
    imag2: loadImag / 3
  });
  const eqImpPhasor = convertComplex.cartesianToPhasor({
    real: eqImpComplex.real,
    imaginary: eqImpComplex.imaginary
  });

  const lineCurrent = complexOperations.divisionPhasor({
    magnitude1: phaseVoltageMagnitude,
    phase1: phaseVoltageAngle,
    magnitude2: eqImpPhasor.magnitude,
    phase2: eqImpPhasor.phase
  });

  const phaseCurrent = {
    magnitude: lineCurrent.magnitude / Math.sqrt(3),
    phase: lineCurrent.phase + 30
  };

  const loadImpPhasor = convertComplex.cartesianToPhasor({ real: loadReal, imaginary: loadImag });
  const loadLineVoltage = complexOperations.multiplicationPhasor({
    magnitude1: phaseCurrent.magnitude,
    phase1: phaseCurrent.phase,
    magnitude2: loadImpPhasor.magnitude,
    phase2: loadImpPhasor.phase
  });

  const singlePhaseLoadActivePower = Math.pow(phaseCurrent.magnitude, 2) * loadReal;
  const singlePhaseLoadReactivePower = Math.pow(phaseCurrent.magnitude, 2) * loadImag;

  const singlePhaseLoadApparentPower = convertComplex.cartesianToPhasor({
    real: singlePhaseLoadActivePower,
    imaginary: singlePhaseLoadReactivePower
  });

  const threePhaseLoadActivePower = {
    magnitude: singlePhaseLoadApparentPower.magnitude * 3,
    phase: singlePhaseLoadApparentPower.phase
  };


  const singlePhaseTransActivePower = Math.pow(lineCurrent.magnitude, 2) * transReal;
  const singlePhaseTransReactivePower = Math.pow(lineCurrent.magnitude, 2) * transImag;
  const singlePhaseTotalApparentPower = convertComplex.cartesianToPhasor({
    real: singlePhaseTransActivePower + singlePhaseLoadActivePower,
    imaginary: singlePhaseTransReactivePower + singlePhaseLoadReactivePower
  });

  const threePhaseTotalApparentPower = {
    magnitude: singlePhaseTotalApparentPower.magnitude * 3,
    phase: singlePhaseTotalApparentPower.phase
  };
  return {
    source: {
      phaseVoltage: { magnitude: phaseVoltageMagnitude, phase: phaseVoltageAngle },
      lineVoltage: sourceLineVoltage,
      lineCurrent: lineCurrent,
      phaseCurrent: phaseCurrent,
      singlePhaseApparentPower: singlePhaseLoadApparentPower,
      threePhaseApparentPower: threePhaseLoadActivePower
    },
    load: {
      phaseVoltage: loadLineVoltage,
      lineVoltage: loadLineVoltage,
      lineCurrent: lineCurrent,
      phaseCurrent: phaseCurrent,
      singlePhaseApparentPower: singlePhaseTotalApparentPower,
      threePhaseApparentPower: threePhaseTotalApparentPower
    }
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
  const Zeq = complexOperations.addComplex({
    real1: realZT,
    imag1: imagZT,
    real2: realZL,
    imag2: imagZL,
  });
  const phasorZeq = convertComplex.cartesianToPhasor({
    real: Zeq.real,
    imaginary: Zeq.imaginary,
  });

  console.log(Zeq);
  const phaseVoltage = {
    magnitude: voltageMagnitude / Math.sqrt(3),
    phase: voltagePhase - 30,
  };
  const lineCurrent = complexOperations.divisionPhasor({
    magnitude1: phaseVoltage.magnitude,
    phase1: phaseVoltage.phase,
    magnitude2: phasorZeq.magnitude,
    phase2: phasorZeq.phase,
  });
  const singlePhaseLoadActivePower =
    Math.pow(lineCurrent.magnitude, 2) * realZL;
  const singlePhaseLoadReactivePower =
    Math.pow(lineCurrent.magnitude, 2) * imagZL;
  const singlePhaseLoadApparentPower = convertComplex.cartesianToPhasor({
    real: singlePhaseLoadActivePower,
    imaginary: singlePhaseLoadReactivePower,
  });
  const threePhaseLoadApparentPower = {
    magnitude: singlePhaseLoadApparentPower.magnitude * 3,
    phase: singlePhaseLoadApparentPower.phase,
  };
  const singlePhaseActivePower =
    Math.pow(lineCurrent.magnitude, 2) * Zeq.real;
  const singlePhaseReactivePower =
    Math.pow(lineCurrent.magnitude, 2) * Zeq.imaginary;
  const singlePhaseApparentPower = convertComplex.cartesianToPhasor({
    real: singlePhaseActivePower,
    imaginary: singlePhaseReactivePower,
  });
  const threePhaseApparentPower = {
    magnitude: singlePhaseApparentPower.magnitude * 3,
    phase: singlePhaseApparentPower.phase,
  };
  return {
    source: {
      phaseVoltage: phaseVoltage,
      lineCurrent: lineCurrent,
      phaseCurrent: null,
      singlePhaseApparentPower: singlePhaseApparentPower,
      threePhaseApparentPower: threePhaseApparentPower,
    },
    load: {
      lineCurrent: lineCurrent,
      phaseCurrent: null,
      singlePhaseApparentPower: singlePhaseLoadApparentPower,
      threePhaseApparentPower: threePhaseLoadApparentPower,
    },
  };
}

export function solveDeltaDelta({
  lineVoltageMagnitude,
  lineVoltagePhase,
  transImpReal,
  transImpImag,
  loadImpReal,
  loadImpImag

}) {
  const phaseVoltage = {
    magnitude: lineVoltageMagnitude / Math.sqrt(3),
    phase: lineVoltagePhase - 30
  };
  const totalImp = complexOperations.addComplex({
    real1: loadImpReal / 3,
    imag1: loadImpImag / 3,
    real2: transImpReal,
    imag2: transImpImag,
  });

  const totalImpPhasor = convertComplex.cartesianToPhasor(totalImp);

  const lineCurrent = complexOperations.divisionPhasor({
    magnitude1: phaseVoltage.magnitude,
    phase1: phaseVoltage.phase,
    magnitude2: totalImpPhasor.magnitude,
    phase2: totalImpPhasor.phase
  });

  const phaseCurrent = {
    magnitude: lineCurrent.magnitude / Math.sqrt(3),
    phase: lineCurrent.phase + 30
  };

  const loadImpPhasor = convertComplex.cartesianToPhasor({
    real: loadImpReal,
    imaginary: loadImpImag
  });
  const loadPhaseVoltage = complexOperations.multiplicationPhasor({
    magnitude1: phaseCurrent.magnitude,
    phase1: phaseCurrent.phase,
    magnitude2: loadImpPhasor.magnitude,
    phase2: loadImpPhasor.phase,
  });

  const loadLineVoltage = {
    magnitude: loadPhaseVoltage.magnitude * Math.sqrt(3),
    phase: loadPhaseVoltage.phase + 30
  };

  const singlePhaseLoadActivePower = Math.pow(phaseCurrent.magnitude, 2) * loadImpReal;
  const singlePhaseLoadReactivePower = Math.pow(phaseCurrent.magnitude, 2) * loadImpImag;
  const singlePhaseLoadApparentPower = convertComplex.cartesianToPhasor({
    real: singlePhaseLoadActivePower,
    imaginary: singlePhaseLoadReactivePower,
  });
  const threePhaseLoadApparentPower = {
    magnitude: singlePhaseLoadApparentPower.magnitude * 3,
    phase: singlePhaseLoadApparentPower.phase,
  };

  const singlePhaseTransActivePower = Math.pow(lineCurrent.magnitude, 2) * transImpReal;
  const singlePhaseTransReactivePower = Math.pow(lineCurrent.magnitude, 2) * transImpImag;

  const singlePhaseTotalApparentPower = convertComplex.cartesianToPhasor({
    real: singlePhaseLoadActivePower + singlePhaseTransActivePower,
    imaginary: singlePhaseLoadReactivePower + singlePhaseTransReactivePower,
  });
  const threePhaseTotalApparentPower = {
    magnitude: singlePhaseTotalApparentPower.magnitude * 3,
    phase: singlePhaseTotalApparentPower.phase
  };

  return {
    source: {
      lineVoltage: { magnitude: lineVoltageMagnitude, phase: lineVoltagePhase },
      lineCurrent: lineCurrent,
      phaseCurrent: null,
      singlePhaseApparentPower: singlePhaseTotalApparentPower,
      threePhaseApparentPower: threePhaseTotalApparentPower,
    },
    load: {
      phaseVoltage: loadPhaseVoltage,
      lineVoltage: loadLineVoltage,
      lineCurrent: lineCurrent,
      phaseCurrent: phaseCurrent,
      singlePhaseApparentPower: singlePhaseLoadApparentPower,
      threePhaseApparentPower: threePhaseLoadApparentPower,
    },
  };

}