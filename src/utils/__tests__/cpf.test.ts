import { onlyDigits, formatCPF, validateCPF } from '../cpf';

describe('CPF utils', () => {
  test('onlyDigits removes non-digits', () => {
    expect(onlyDigits('123.456.789-09')).toBe('12345678909');
    expect(onlyDigits('abc-123-xyz')).toBe('123');
  });

  test('formatCPF masks partial and full inputs', () => {
    expect(formatCPF('1')).toBe('1');
    expect(formatCPF('12')).toBe('12');
    expect(formatCPF('123')).toBe('123');
    expect(formatCPF('1234')).toBe('123.4');
    expect(formatCPF('123456')).toBe('123.456');
    expect(formatCPF('1234567')).toBe('123.456.7');
    expect(formatCPF('12345678909')).toBe('123.456.789-09');
  });

  test('validateCPF recognizes valid and invalid CPFs', () => {
    // example of a (valid?) CPF for tests — using known valid sample: 529.982.247-25
    expect(validateCPF('52998224725')).toBe(true);
    expect(validateCPF('529.982.247-25')).toBe(true);
    expect(validateCPF('11111111111')).toBe(false);
    expect(validateCPF('12345678901')).toBe(false);
  });
});
