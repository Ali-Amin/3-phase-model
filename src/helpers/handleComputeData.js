import * as circuitSolver from "./circuitSolver";
import * as convertComplex from "./convertComplex";

const handleComputeClick = ({
  ImpedanceTRValue,
  ImpedanceLoadValue,
  voltageValue,
  connection
}) => {
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
    case "StarStar":
      newOutput = circuitSolver.starStarSolver({
        sourceMag: eval(voltageValue.magnitude),
        sourcePhase: eval(voltageValue.phase),
        transmissionReal: transmissionImpedance.real,
        transmissionImag: transmissionImpedance.imaginary,
        loadReal: loadImpedance.real,
        loadImag: loadImpedance.imaginary,
      });
      break;

    case "DeltaStar":
      newOutput = circuitSolver.deltaStar({
        voltageMagnitude: eval(voltageValue.magnitude),
        voltagePhase: eval(voltageValue.phase),
        realZL: loadImpedance.real,
        imagZL: loadImpedance.imaginary,
        realZT: transmissionImpedance.real,
        imagZT: transmissionImpedance.imaginary,
      });
      break;

    case "StarDelta":
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

  console.log(newOutput);
  return newOutput;
};

export default handleComputeClick;
