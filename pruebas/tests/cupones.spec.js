import { test, expect } from '../fixtures/cupones.js';
import { cupones, correoUnico } from '../data/cupones.js';

test.describe('HU-04 · Cupones', () => {
  test('CP-U01 CAFE10 con subtotal 50000 @acceptanceTest', async ({ paginaCupones }) => {
    await paginaCupones.aplicar(cupones.vigente, 50000, correoUnico());
    await expect(paginaCupones.estado).toHaveText('aplicado');
    await expect(paginaCupones.descuento).toHaveText('$5000');
    await expect(paginaCupones.total).toHaveText('$45000');
  });

  test('CP-U02 el descuento se redondea @acceptanceTest', async ({ paginaCupones }) => {
    await paginaCupones.aplicar(cupones.vigente, 12345, correoUnico());
    await expect(paginaCupones.descuento).toHaveText('$1235');
    await expect(paginaCupones.total).toHaveText('$11110');
  });

  test('CP-U03 el código en minúsculas también se aplica @acceptanceTest', async ({ paginaCupones }) => {
    await paginaCupones.aplicar('cafe10', 50000, correoUnico());
    await expect(paginaCupones.estado).toHaveText('aplicado');
    await expect(paginaCupones.descuento).toHaveText('$5000');
  });

  test('CP-U04 un cupón vencido no se aplica @bug', async ({ paginaCupones }) => {
    await paginaCupones.aplicar(cupones.vencido, 50000, correoUnico());
    await expect(paginaCupones.mensaje).toHaveText('El cupón está vencido');
    await expect(paginaCupones.estado).toHaveCount(0);
  });

  test('CP-U05 aplicar y usar un cupón @acceptanceTest', async ({ paginaCupones }) => {
    await paginaCupones.aplicar(cupones.vigente, 50000, correoUnico());
    await paginaCupones.usar();
    await expect(paginaCupones.estado).toHaveText('usado');
  });

  test('CP-U06 un cupón ya usado por el cliente muestra error @acceptanceTest', async ({ paginaCupones }) => {
    const correo = correoUnico();
    await paginaCupones.aplicar(cupones.vigente, 50000, correo);
    await paginaCupones.usar();
    await expect(paginaCupones.estado).toHaveText('usado');
    await paginaCupones.aplicar(cupones.vigente, 50000, correo);
    await expect(paginaCupones.mensaje).toHaveText('Este cupón ya fue usado por este cliente');
  });

  test('CP-U07 usar dos veces el mismo cupón muestra error @acceptanceTest', async ({ paginaCupones }) => {
    await paginaCupones.aplicar(cupones.vigente, 50000, correoUnico());
    await paginaCupones.usar();
    await expect(paginaCupones.estado).toHaveText('usado');
    await paginaCupones.usar();
    await expect(paginaCupones.mensaje).toHaveText('Este cupón ya fue usado por este cliente');
  });

  test('CP-U08 otro cliente sí puede usar el cupón @acceptanceTest', async ({ paginaCupones }) => {
    await paginaCupones.aplicar(cupones.vigente, 50000, correoUnico());
    await paginaCupones.usar();
    await expect(paginaCupones.estado).toHaveText('usado');
    await paginaCupones.aplicar(cupones.vigente, 50000, correoUnico());
    await expect(paginaCupones.estado).toHaveText('aplicado');
  });

  test('CP-U09 un cupón inexistente muestra error @acceptanceTest', async ({ paginaCupones }) => {
    await paginaCupones.aplicar(cupones.inexistente, 50000, correoUnico());
    await expect(paginaCupones.mensaje).toHaveText('El cupón no existe');
  });

  test('CP-U10 un subtotal en cero muestra error @acceptanceTest', async ({ paginaCupones }) => {
    await paginaCupones.aplicar(cupones.vigente, 0, correoUnico());
    await expect(paginaCupones.mensaje).toHaveText('El subtotal debe ser mayor que 0');
  });

  test('CP-U11 sin correo del cliente muestra error @acceptanceTest', async ({ paginaCupones }) => {
    await paginaCupones.aplicar(cupones.vigente, 50000, '');
    await expect(paginaCupones.mensaje).toHaveText('Indica el correo del cliente');
  });
});
