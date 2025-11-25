export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function formatCPF(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0,3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`;
  // length 10 or 11
  return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9)}`;
}

// Classic CPF checksum validation
export function validateCPF(value: string) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  // reject CPFs with all digits the same
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcCheck = (slice: string) => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) {
      sum += Number(slice[i]) * ((slice.length + 1) - i);
    }
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const firstCheck = calcCheck(cpf.slice(0, 9));
  if (firstCheck !== Number(cpf[9])) return false;
  const secondCheck = calcCheck(cpf.slice(0, 10));
  if (secondCheck !== Number(cpf[10])) return false;
  return true;
}
