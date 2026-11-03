export class PaginaLogin {
  constructor(page) {
    this.page = page;
    this.campoCorreo = page.getByLabel('Correo');
    this.campoClave = page.getByLabel('Contraseña');
    this.botonIniciar = page.getByRole('button', { name: 'Iniciar sesión' });
    this.menuCarrito = page.getByRole('button', { name: 'Carrito', exact: true });
    this.mensaje = page.getByRole('status');
  }

  async ir() {
    await this.page.goto('/');
  }

  async iniciarSesion(correo, clave) {
    await this.campoCorreo.fill(correo);
    await this.campoClave.fill(clave);
    await this.botonIniciar.click();
  }
}
