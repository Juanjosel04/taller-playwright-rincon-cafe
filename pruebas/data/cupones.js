export const cupones = {
  vigente: 'CAFE10',
  vencido: 'VENCIDO20',
  inexistente: 'NOEXISTE99',
};

export function correoUnico() {
  const sufijo = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `cliente-${sufijo}@prueba.test`;
}
