export class PaginaCarrito {
  constructor(page) {
    this.page = page;
    this.menuCarrito = page.getByRole('button', { name: 'Carrito', exact: true });
    this.selectorProducto = page.getByLabel('Producto');
    this.campoCantidad = page.getByLabel('Cantidad');
    this.selectorTamano = page.getByLabel('Tamaño');
    this.botonAgregar = page.getByRole('button', { name: 'Agregar al carrito' });
    this.botonConfirmar = page.getByRole('button', { name: 'Confirmar carrito' });
    this.botonVaciar = page.getByRole('button', { name: 'Vaciar carrito' });
    this.estado = page.getByTestId('estado-carrito');
    this.subtotal = page.getByTestId('subtotal');
    this.mensaje = page.getByRole('status');
  }

  async ir() {
    await this.menuCarrito.click();
    await this.estado.waitFor();
  }

  async agregarProducto(nombre, cantidad, tamano) {
    await this.selectorProducto.selectOption({ label: nombre });
    await this.campoCantidad.fill(String(cantidad));
    if (tamano) {
      await this.selectorTamano.selectOption(tamano);
    }
    await this.botonAgregar.click();
  }

  async vaciar() {
    await this.botonVaciar.click();
    await this.mensaje.filter({ hasText: 'Carrito vacío' }).waitFor();
  }

  async confirmar() {
    await this.botonConfirmar.click();
  }

  itemDeLista(texto) {
    return this.page.getByRole('listitem').filter({ hasText: texto });
  }

  async agregarPorApi(productoId, cantidad) {
    return this.page.request.post('/api/carrito', { data: { productoId, cantidad } });
  }

  async mensajeDeValidacionCantidad() {
    return this.campoCantidad.evaluate((campo) => campo.validationMessage);
  }
}
