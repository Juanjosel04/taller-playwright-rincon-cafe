import { test, expect } from '../fixtures/carrito.js';
import { espresso, latte, capuchino, teVerde, croissant } from '../data/productos.js';

test.describe('HU-03 · Carrito', () => {
  test('CP-C01 estado inicial del carrito', async ({ paginaCarrito }) => {
    await expect(paginaCarrito.estado).toHaveText('vacío');
    await expect(paginaCarrito.subtotal).toHaveText('$0');
  });

  test('CP-C02 subtotal de un producto = precio × cantidad @bug', async ({ paginaCarrito }) => {
    await paginaCarrito.agregarProducto(latte.nombre, 3);
    await expect(paginaCarrito.subtotal).toHaveText(`$${latte.precio * 3}`);
  });

  test('CP-C03 cantidad mínima permitida (1)', async ({ paginaCarrito }) => {
    await paginaCarrito.agregarProducto(espresso.nombre, 1);
    await expect(paginaCarrito.subtotal).toHaveText(`$${espresso.precio}`);
  });

  test('CP-C04 cantidad máxima permitida (10) @bug', async ({ paginaCarrito }) => {
    await paginaCarrito.agregarProducto(teVerde.nombre, 10);
    await expect(paginaCarrito.subtotal).toHaveText(`$${teVerde.precio * 10}`);
  });

  test('CP-C05 subtotal del carrito = suma de los subtotales @bug', async ({ paginaCarrito }) => {
    await paginaCarrito.agregarProducto(latte.nombre, 2);
    await paginaCarrito.agregarProducto(croissant.nombre, 3);
    await expect(paginaCarrito.subtotal).toHaveText(`$${latte.precio * 2 + croissant.precio * 3}`);
  });

  test('CP-C06 agregar un producto cambia el estado a "con productos"', async ({ paginaCarrito }) => {
    await expect(paginaCarrito.estado).toHaveText('vacío');
    await paginaCarrito.agregarProducto(espresso.nombre, 1);
    await expect(paginaCarrito.estado).toHaveText('con productos');
  });

  test('CP-C07 cantidad 0 es rechazada por el campo', async ({ paginaCarrito }) => {
    await paginaCarrito.agregarProducto(espresso.nombre, 0);
    expect(await paginaCarrito.mensajeDeValidacionCantidad()).not.toBe('');
    await expect(paginaCarrito.estado).toHaveText('vacío');
    await expect(paginaCarrito.subtotal).toHaveText('$0');
  });

  test('CP-C08 cantidad 11 es rechazada por el campo', async ({ paginaCarrito }) => {
    await paginaCarrito.agregarProducto(espresso.nombre, 11);
    expect(await paginaCarrito.mensajeDeValidacionCantidad()).not.toBe('');
    await expect(paginaCarrito.estado).toHaveText('vacío');
    await expect(paginaCarrito.subtotal).toHaveText('$0');
  });

  test('CP-C13 producto y tamaño aparecen en la lista', async ({ paginaCarrito }) => {
    await paginaCarrito.agregarProducto(capuchino.nombre, 2, 'grande');
    await expect(paginaCarrito.itemDeLista('Capuchino × 2 (grande)')).toBeVisible();
  });

  test('CP-C14 vaciar el carrito lo deja en cero', async ({ paginaCarrito }) => {
    await paginaCarrito.agregarProducto(latte.nombre, 2);
    await paginaCarrito.vaciar();
    await expect(paginaCarrito.estado).toHaveText('vacío');
    await expect(paginaCarrito.subtotal).toHaveText('$0');
  });

  test('CP-C15 confirmar un carrito con productos', async ({ paginaCarrito }) => {
    await paginaCarrito.agregarProducto(espresso.nombre, 1);
    await paginaCarrito.confirmar();
    await expect(paginaCarrito.estado).toHaveText('confirmado');
  });

  test('CP-C16 confirmar un carrito vacío muestra error', async ({ paginaCarrito }) => {
    await paginaCarrito.confirmar();
    await expect(paginaCarrito.mensaje).toHaveText('El carrito está vacío');
    await expect(paginaCarrito.estado).toHaveText('vacío');
  });
});
