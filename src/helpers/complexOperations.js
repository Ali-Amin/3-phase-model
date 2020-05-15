export function add({ real1, imag1, real2, imag2 }) {
    const realPart = real1 +real2;
    const imaginaryPart = imag1 + imag2;
    return { real: realPart, imaginary: imaginaryPart };
}

export function subtract({ real1, imag1, real2, imag2 }) {
    const realPart = real1 - real2;
    const imaginaryPart = imag1 - imag2;
    return { real: realPart, imaginary: imaginaryPart };
}
export function multiplication({ magnitude1, phase1, magnitude2, phase2 }) {
    const magnitude = magnitude1 * magnitude2;
    const phase = phase1 + phase2;
    return { magnitude: magnitude, phase: phase };
}
export function division({ magnitude1, phase1, magnitude2, phase2 }) {
    const magnitude = magnitude1 / magnitude2;
    const phase = phase1 - phase2;
    return { magnitude: magnitude, phase: phase };
}

