import posthog from 'posthog-js';

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    // Only initialize if we are in a production-like environment or explicitly enabled
    // For now, we'll scaffold it with placeholder check
    const apiKey = import.meta.env.PUBLIC_POSTHOG_KEY;
    const host = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

    if (apiKey) {
      posthog.init(apiKey, {
        api_host: host,
        person_profiles: 'identified_only',
        capture_pageview: true,
      });
    }
  }
};

export const captureEvent = (name: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(name, properties);
  }
};
