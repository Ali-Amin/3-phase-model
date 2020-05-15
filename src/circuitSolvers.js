import { divisionPhasor, addComplex, multiplicationPhasor } from './helpers/complexOperations';
import { cartesianToPhasor } from './helpers/convertComplex';

export function solveStarDelta({
    phaseVoltageMagnitude,
    phaseVoltageAngle,
    transReal,
    transImag,
    loadReal,
    loadImag
}) {
    const sourceLineVoltage = cartesianToPhasor({
        magnitude: phaseVoltageMagnitude * Math.sqrt(3),
        phase: phaseVoltageAngle + 30
    });


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

    const loadImpPhasor = cartesianToPhasor({ real: loadReal, imaginary: loadImag });
    const loadLineVoltage = multiplicationPhasor({
        magnitude1: phaseCurrent.magnitude,
        phase1: phaseCurrent.phase,
        magnitude2: loadImpPhasor.magnitude,
        phase2: loadImpPhasor.phase
    });

    const singlePhaseLoadActivePower = Math.pow(phaseCurrent.magnitude, 2) * loadReal;
    const singlePhaseLoadReactivePower = Math.pow(phaseCurrent.magnitude * loadImag);
    const singlePhaseLoadApparentPower = cartesianToPhasor({
        real: singlePhaseLoadActivePower,
        imaginary: singlePhaseLoadReactivePower
    });
    const threePhaseLoadActivePower = {
        magnitude: singlePhaseLoadApparentPower.magnitude * 3,
        phase: singlePhaseLoadApparentPower.phase
    };


    const singlePhaseTransActivePower = Math.pow(lineCurrent, 2) * transReal;
    const singlePhaseTransReactivePower = Math.pow(lineCurrent, 2) * transImag;
    const singlePhaseTotalApparentPower = cartesianToPhasor({
        real: singlePhaseTransActivePower,
        imaginary: singlePhaseTransReactivePower
    });
    const threePhaseTotalApparentPower = {
        magnitude: singlePhaseTotalApparentPower.magnitude * 3,
        phase: singlePhaseTotalApparentPower.phase
    };

    return {
        source: {
            phaseVoltage: cartesianToPhasor({ magnitude: phaseVoltageMagnitude, phase: phaseVoltageAngle }),
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
