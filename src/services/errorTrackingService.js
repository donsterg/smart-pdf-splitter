import * as Sentry from '@sentry/react';

import {
  SENTRY_DSN
} from '../config/appConfig';

export const initErrorTracking = () => {

  if (!SENTRY_DSN) {

    console.warn(
      'Sentry DSN missing'
    );

    return;
  }

  Sentry.init({

    dsn: SENTRY_DSN,

    integrations: [
      Sentry.browserTracingIntegration(),
    ],

    tracesSampleRate: 1.0,
  });
};

export const captureError = (
  error,
  context = {}
) => {

  console.error(error);

  Sentry.captureException(
    error,
    {
      extra: context,
    }
  );
};