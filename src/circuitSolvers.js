import { divisionPhasor, addComplex } from './helpers/complexOperations';
import { cartesianToPhasor } from './helpers/convertComplex';

export function solveDeltaStar({
    phaseVoltageMagnitude,
    phaseVoltageAngle,
    transReal,
    transImag,
    loadReal,
    loadImag
}) {

    const eqImpComplex = addComplex({
        real1: transReal,
        imag1: transImag,
        real2: loadReal,
        imag2: loadImag
    });

    const eqImpPhasor = cartesianToPhasor({
        real: eqImpComplex.real,
        imaginary: eqImpComplex.imaginary
    });

    const phaseCurrent = divisionPhasor({
        magnitude1: phaseVoltageMagnitude,
        phase1: phaseVoltageAngle,
        magnitude2: eqImpPhasor.magnitude / 3,
        phase2: eqImpPhasor.phase
    });

    const lineCurrent = {
        magnitude: Math.sqrt(3) * phaseCurrent.magnitude,
        phase: phaseCurrent.phase - 30
    };

    const loadActivePower = Math.pow(phaseCurrent.magnitude, 2) * loadReal;
    const loadReactivePower = Math.pow(phaseCurrent.magnitude * loadImag);


}