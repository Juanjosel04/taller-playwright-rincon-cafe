import { test as base, expect } from './login.js';
import { PaginaCarrito } from '../pages/PaginaCarrito.js';

export const test = base.extend({
  paginaCarrito: async ({ paginaLogueada }, use) => {
    const paginaCarrito = new PaginaCarrito(paginaLogueada);
    await paginaCarrito.ir();
    await paginaCarrito.vaciar();
    await use(paginaCarrito);
  },
});

export { expect };
