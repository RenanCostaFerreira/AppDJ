function onlyDigits(value) { return ('' + value).replace(/\D/g, ''); }
function validateCPF(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  const calcCheck = (slice) => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) {
      sum += Number(slice[i]) * ((slice.length + 1) - i);
    }
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };
  const firstCheck = calcCheck(cpf.slice(0, 9));
  const secondCheck = calcCheck(cpf.slice(0, 10));
  return firstCheck === Number(cpf[9]) && secondCheck === Number(cpf[10]);
}

const tests = ['52998224725','529.982.247-25','11111111111','12345678901','12345678909'];
for (const t of tests) {
  console.log(t, validateCPF(t));
}
