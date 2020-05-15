export function addComplex({real1, imag1, real2, imag2}) {
  const realPart = real1 + real2;
  const imaginaryPart = imag1 + imag2;
  return {real: realPart, imaginary: imaginaryPart};
}

export function subtractComplex({real1, imag1, real2, imag2}) {
  const realPart = real1 - real2;
  const imaginaryPart = imag1 - imag2;
  return {real: realPart, imaginary: imaginaryPart};
}
export function multiplicationPhasor({magnitude1, phase1, magnitude2, phase2}) {
  const magnitude = magnitude1 * magnitude2;
  const phase = phase1 + phase2;
  return {magnitude: magnitude, phase: phase};
}
export function divisionPhasor({magnitude1, phase1, magnitude2, phase2}) {
  const magnitude = magnitude1 / magnitude2;
  const phase = phase1 - phase2;
  return {magnitude: magnitude, phase: phase};
}
