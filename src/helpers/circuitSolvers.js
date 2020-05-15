import {divisionPhasor, multiplicationPhasor} from './complexOperations';
import {cartesianToPhasor} from './convertComplex';
import {addComplex} from './complexOperations';

export function deltaStar({
  voltageMagnitude,
  voltagePhase,
  realZT,
  imagZT,
  realZL,
  imagZL,
}) {
  const Zeq = addComplex({
    real1: realZT,
    imag1: imagZT,
    real2: realZL,
    imag2: imagZL,
  });
  const phasorZeq = cartesianToPhasor({
    real: Zeq.real,
    imaginary: Zeq.imaginary,
  });

  console.log(Zeq);
  const phaseVoltage = {
    magnitude: voltageMagnitude / Math.sqrt(3),
    phase: voltagePhase - 30,
  };
  const lineCurrent = divisionPhasor({
    magnitude1: phaseVoltage.magnitude,
    phase1: phaseVoltage.phase,
    magnitude2: phasorZeq.magnitude,
    phase2: phasorZeq.phase,
  });
  const phasorLoad = cartesianToPhasor ({
    real: realZL,
    imaginary: imagZL
  });
  const loadPhaseVoltage= multiplicationPhasor({
    magnitude1: lineCurrent.magnitude,
    phase1: lineCurrent.phase,
    magnitude2: phasorLoad.magnitude,
    phase2: phasorLoad.phase,
  });
  const singlePhaseLoadActivePower =
    Math.pow(lineCurrent.magnitude, 2) * realZL;
  const singlePhaseLoadReactivePower =
    Math.pow(lineCurrent.magnitude, 2) * imagZL;
  const singlePhaseLoadApparentPower = cartesianToPhasor({
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
  const singlePhaseApparentPower = cartesianToPhasor({
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
      phaseCurrent: lineCurrent,
      singlePhaseApparentPower: singlePhaseApparentPower,
      threePhaseApparentPower: threePhaseApparentPower,
    },
    load: {
      lineCurrent: lineCurrent,
      phaseCurrent: lineCurrent,
      loadPhaseVoltage: loadPhaseVoltage,
      singlePhaseApparentPower: singlePhaseLoadApparentPower,
      threePhaseApparentPower: threePhaseLoadApparentPower,
    },
  };
}