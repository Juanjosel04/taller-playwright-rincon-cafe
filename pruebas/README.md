# Pruebas de Playwright

Pruebas E2E de HU-03 (carrito) y HU-04 (cupones) de El Rincón del Café. La explicación completa, la tabla de casos y los bugs encontrados están en el [README de la raíz](../README.md).

```bash
npm install
npx playwright install
npx playwright test
```

La app debe estar corriendo en `http://localhost:3000`, o se indica otra con la variable `BASE_URL`.
