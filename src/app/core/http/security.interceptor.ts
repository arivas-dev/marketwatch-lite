import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

/** Solo se inyecta credencial para este origen (CoinGecko API v3). */
const ALLOWED_COINGECKO_ORIGIN = 'https://api.coingecko.com';

/**
 * Interceptor orientado a seguridad del cliente:
 * - Lista blanca de origen: la API key solo se añade a peticiones HTTPS a `api.coingecko.com`.
 * - No sobrescribe `x-cg-demo-api-key` si ya viene definido (p. ej. tests).
 * - Normaliza errores sensibles (401/403, 429, 5xx) sin propagar cuerpos crudos de la API.
 */
export const securityInterceptor: HttpInterceptorFn = (req, next) => {
  const augmented = withCoinGeckoApiKeyIfAllowed(req);
  return next(augmented).pipe(
    catchError((err: unknown) => throwError(() => sanitizeHttpError(err))),
  );
};

function withCoinGeckoApiKeyIfAllowed(
  req: HttpRequest<unknown>,
): HttpRequest<unknown> {
  let origin: string;
  try {
    origin = new URL(req.url).origin;
  } catch {
    return req;
  }

  if (origin !== ALLOWED_COINGECKO_ORIGIN) {
    return req;
  }

  const key = environment.coingeckoDemoApiKey.trim();
  if (!key || req.headers.has('x-cg-demo-api-key')) {
    return req;
  }

  return req.clone({
    setHeaders: {
      'x-cg-demo-api-key': key,
    },
  });
}

function sanitizeHttpError(err: unknown): unknown {
  if (!(err instanceof HttpErrorResponse)) {
    return err;
  }

  const status = err.status;
  const url = err.url ?? '';

  if (status === 401 || status === 403) {
    return new HttpErrorResponse({
      error: { code: 'FORBIDDEN', message: 'Acceso no autorizado al recurso.' },
      headers: err.headers,
      status,
      statusText: err.statusText,
      url,
    });
  }

  if (status === 429) {
    return new HttpErrorResponse({
      error: {
        code: 'RATE_LIMIT',
        message: 'Demasiadas peticiones. Espera un momento e inténtalo de nuevo.',
      },
      headers: err.headers,
      status,
      statusText: err.statusText,
      url,
    });
  }

  if (status >= 500) {
    return new HttpErrorResponse({
      error: {
        code: 'SERVER_ERROR',
        message: 'El servicio no está disponible temporalmente.',
      },
      headers: err.headers,
      status,
      statusText: err.statusText,
      url,
    });
  }

  return err;
}
