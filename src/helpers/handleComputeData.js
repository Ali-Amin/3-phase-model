import * as circuitSolver from "./circuitSolver";
import * as convertComplex from "./convertComplex";

const handleComputeData = ({
  ImpedanceTRValue,
  ImpedanceLoadValue,
  voltageValue,
  connection
}) => {
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
    case "StarStar":
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

    case "StarDelta":
      newOutput = circuitSolver.starDelta({
        phaseVoltageMagnitude: parseFloat(voltageValue.magnitude),
        phaseVoltageAngle: parseFloat(voltageValue.phase),
        transReal: transmissionImpedance.real,
        transImag: transmissionImpedance.imaginary,
        loadReal: loadImpedance.real,
        loadImag: loadImpedance.imaginary,
      });
      break;
    
    case "DeltaDelta":
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

  return newOutput
};

export default handleComputeData;
