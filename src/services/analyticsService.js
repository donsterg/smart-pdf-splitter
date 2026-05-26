import posthog from 'posthog-js';

import {
  POSTHOG_KEY
} from '../config/appConfig';

export const initAnalytics = () => {

  if (!POSTHOG_KEY) {
    console.warn(
      'PostHog key missing'
    );
    return;
  }

  posthog.init(
    POSTHOG_KEY,
    {
      api_host:
        'https://app.posthog.com',
    }
  );
};

export const trackEvent = (
  eventName,
  properties = {}
) => {

  posthog.capture(
    eventName,
    properties
  );
};