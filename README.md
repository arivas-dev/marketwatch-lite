# MarketWatch Lite

Aplicación web orientada a la consulta de precios e información de mercado de criptoactivos. La información se obtiene mediante la [API de CoinGecko](https://www.coingecko.com/en/api/).

**Demostración:** [https://marketwatch-lite.netlify.app/](https://marketwatch-lite.netlify.app/)

El proyecto se desarrolla con Angular (componentes en modo standalone y estado basado en signals), estilos con Tailwind CSS.

## Funcionalidades principales

- Listado paginado de activos, con posibilidad de actualizar los datos de forma manual.
- Filtrado del listado por nombre, símbolo o identificador del activo.
- Ventana modal con información ampliada sobre el activo seleccionado.
- Presentación de errores de carga en la interfaz, con acción para reintentar la solicitud.
- Configuración opcional de la clave de la API en modo demo de CoinGecko mediante variable de entorno; dicha clave se aplica únicamente a las solicitudes dirigidas a `api.coingecko.com`.

## Complementos implementados (bonus)

Además del alcance básico, se incorporaron las siguientes capacidades:

- **Interceptor HTTP:** manejo centralizado de las solicitudes salientes, con inyección condicional de la clave de API exclusivamente hacia el origen autorizado de CoinGecko y tratamiento uniforme de respuestas erróneas (por ejemplo, límites de uso o fallos del servidor), sin exponer en la interfaz el detalle técnico de las respuestas.
- **Modo de visualización (claro u oscuro):** conmutación entre temas y persistencia de la preferencia en el almacenamiento local del navegador.
- **Selección de formato de listado:** visualización en tarjetas (disposición en cuadrícula adaptable) o en formato tabular; la preferencia seleccionada se conserva entre sesiones.
- **Gráficos de precios:** integración con ApexCharts (ng-apexcharts) para series compactas en las tarjetas y para el gráfico del detalle en el modal; en este último caso se utiliza carga diferida (`@defer`) con el fin de no incrementar el coste de renderizado inicial de la vista.

## Requisitos del entorno

- Node.js (se recomienda una versión con soporte LTS).
- npm.

## Ejecución en entorno local

```bash
npm install
npm start
```

Tras el arranque, la aplicación queda disponible en `http://localhost:4200/`.

## Variables de entorno

En el directorio raíz del repositorio debe crearse un archivo denominado `.env` con el siguiente contenido cuando se desee utilizar la clave en modo demo:

```bash
VITE_COINGECKO_DEMO_API_KEY=tu_clave
```


## Scripts disponibles

| Comando         | Descripción                          |
| --------------- | ------------------------------------ |
| `npm start`     | Inicio del servidor de desarrollo    |
| `npm run build` | Generación del artefacto de producción |
| `npm test`      | Ejecución de la batería de pruebas   |

## Datos y atribución

*Data provided by [CoinGecko](https://www.coingecko.com/).* · [Atribución y marca](https://brand.coingecko.com/resources/attribution-guide)
