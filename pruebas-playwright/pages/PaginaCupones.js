export class PaginaCupones {
  constructor(page) {
    this.page = page;
    this.menuCupones = page.getByRole('button', { name: 'Cupones', exact: true });
    this.campoCodigo = page.getByLabel('Código');
    this.campoSubtotal = page.getByLabel('Subtotal');
    this.campoCorreo = page.getByLabel('Correo del cliente');
    this.botonAplicar = page.getByRole('button', { name: 'Aplicar cupón' });
    this.botonUsar = page.getByRole('button', { name: 'Usar cupón' });
    this.estado = page.getByTestId('estado-cupon');
    this.descuento = page.getByTestId('descuento');
    this.total = page.getByTestId('total-cupon');
    this.mensaje = page.getByRole('status');
  }

  async ir() {
    await this.menuCupones.click();
    await this.botonAplicar.waitFor();
  }

  async aplicar(codigo, subtotal, correo) {
    await this.campoCodigo.fill(codigo);
    await this.campoSubtotal.fill(String(subtotal));
    await this.campoCorreo.fill(correo);
    await this.botonAplicar.click();
  }

  async usar() {
    await this.botonUsar.click();
  }
}
