import { test, expect } from '../fixtures/login.js';
import { PaginaLogin } from '../pages/PaginaLogin.js';
import { usuarioDePrueba } from '../data/usuarios.js';

test.describe('Inicio de sesión', () => {
  test('el usuario de prueba entra a la app', async ({ paginaLogueada }) => {
    await expect(paginaLogueada.getByRole('button', { name: 'Carrito', exact: true })).toBeVisible();
  });

  test('una clave incorrecta muestra error', async ({ page }) => {
    const paginaLogin = new PaginaLogin(page);
    await paginaLogin.ir();
    await paginaLogin.iniciarSesion(usuarioDePrueba.correo, 'ClaveIncorrecta');
    await expect(page.getByRole('status')).toHaveText('Credenciales inválidas');
  });
});
