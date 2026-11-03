export class PaginaLogin {
  constructor(page) {
    this.page = page;
    this.campoCorreo = page.getByLabel('Correo');
    this.campoClave = page.getByLabel('Contraseña');
    this.botonIniciar = page.getByRole('button', { name: 'Iniciar sesión' });
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
