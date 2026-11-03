import { test, expect } from '../fixtures/login.js';
import { PaginaLogin } from '../pages/PaginaLogin.js';
import { usuarioDePrueba } from '../data/usuarios.js';

test.describe('Inicio de sesión', () => {
  test('el usuario de prueba entra a la app @acceptanceTest', async ({ paginaLogueada }) => {
    const paginaLogin = new PaginaLogin(paginaLogueada);
    await expect(paginaLogin.menuCarrito).toBeVisible();
  });

  test('una clave incorrecta muestra error @acceptanceTest', async ({ page }) => {
    const paginaLogin = new PaginaLogin(page);
    await paginaLogin.ir();
    await paginaLogin.iniciarSesion(usuarioDePrueba.correo, 'ClaveIncorrecta');
    await expect(paginaLogin.mensaje).toHaveText('Credenciales inválidas');
  });
});
