import { test as base, expect } from './login.js';
import { PaginaCupones } from '../pages/PaginaCupones.js';

export const test = base.extend({
  paginaCupones: async ({ paginaLogueada }, use) => {
    const paginaCupones = new PaginaCupones(paginaLogueada);
    await paginaCupones.ir();
    await use(paginaCupones);
  },
});

export { expect };
