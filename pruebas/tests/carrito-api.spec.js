import { test, expect } from '../fixtures/carrito.js';
import { espresso } from '../data/productos.js';

test.describe('HU-03 · Carrito (validación de cantidad por API)', () => {
  const cantidadesInvalidas = [
    { id: 'CP-C09', cantidad: 0 },
    { id: 'CP-C10', cantidad: 11 },
    { id: 'CP-C11', cantidad: -1 },
    { id: 'CP-C12', cantidad: 2.5 },
  ];

  for (const { id, cantidad } of cantidadesInvalidas) {
    test(`${id} la API rechaza la cantidad ${cantidad} @acceptanceTest`, async ({ paginaCarrito }) => {
      const respuesta = await paginaCarrito.agregarPorApi(espresso.id, cantidad);
      expect(respuesta.status()).toBe(400);
      expect(await respuesta.json()).toEqual({ error: 'La cantidad debe estar entre 1 y 10' });
    });
  }
});
