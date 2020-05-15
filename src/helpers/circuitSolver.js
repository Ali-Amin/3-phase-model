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
