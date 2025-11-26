function onlyDigits(value) { return ('' + value).replace(/\D/g, ''); }
function formatCPF(value) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0,3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`;
  return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9)}`;
}
function safeDigits(v) { return (v ?? '').replace(/\D/g, ''); }
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

// Simulate register
const users = [];
function register({ name, email, role, cpf, password }) {
  users.push({ name, email, role, cpf, password });
}

function login({ typedCpf, typedEmail, password, loginRole }) {
  let found = null;
  if (loginRole === 'responsavel' || loginRole === 'aluno') {
    // primary: correct role + cpf
    found = users.find((u) => u.role === loginRole && safeDigits(u.cpf) === typedCpf && (u.password ?? '') === password);
    if (!found) {
      // fallback 1: any role with matching CPF
      found = users.find((u) => safeDigits(u.cpf) === typedCpf && (u.password ?? '') === password);
    }
    if (!found) {
      // fallback 2: maybe the user typed a value that looks like a CPF but the account uses email; try email+password
      found = users.find((u) => (u.email ?? '').toLowerCase() === typedEmail && (u.password ?? '') === password);
    }
  } else {
    found = users.find((u) => (u.email ?? '').toLowerCase() === typedEmail && (u.password ?? '') === password);
  }
  return found;
}

// Test scenario
register({name:'Rc', email:'rc@test.com', role:'responsavel', cpf:'52998224725', password:'123456'});

const typedCpf = onlyDigits('529.982.247-25');
console.log('typedCpf', typedCpf, 'length', typedCpf.length);
const typedEmail = '';
console.log('validate', validateCPF(typedCpf));
console.log('login found', login({typedCpf, typedEmail, password: '123456', loginRole: 'responsavel'}));

// wrong password
console.log('login wrong pass', login({typedCpf, typedEmail, password: 'wrong', loginRole: 'responsavel'}));

// login by email with cpf in account
console.log('login by email', login({typedCpf:'', typedEmail:'rc@test.com', password: '123456', loginRole: 'funcionario'}));
