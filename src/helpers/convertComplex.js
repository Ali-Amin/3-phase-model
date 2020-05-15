export function phasorToCartesian({ magnitude, phase }) {
    const phaseInRad = (phase * Math.PI) / 180;
    const real = magnitude * Math.cos(phaseInRad);
    const imaginary = magnitude * Math.sin(phaseInRad);
    return { real: real, imaginary: imaginary };
}

export function cartesianToPhasor({ real, imaginary }) {
    const phase = (Math.atan(imaginary / real) * 180) / Math.PI;
    const magnitude = Math.sqrt(Math.pow(real, 2) + Math.pow(imaginary, 2));
    return { phase: phase, magnitude: magnitude };
}
