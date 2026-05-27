export const ENV = {

  APP_NAME:
    import.meta.env.VITE_APP_NAME,

  ENVIRONMENT:
    import.meta.env.VITE_ENVIRONMENT,

  FREE_PAGE_LIMIT:
    Number(
      import.meta.env.VITE_FREE_PAGE_LIMIT
    ),

  MAX_FILE_MB:
    Number(
      import.meta.env.VITE_MAX_FILE_MB
    ),

  OCR_LANGUAGE:
    import.meta.env.VITE_OCR_LANGUAGE,

  PDF_RENDER_SCALE:
    Number(
      import.meta.env.VITE_PDF_RENDER_SCALE
    ),

  PDF_PREVIEW_SCALE:
    Number(
      import.meta.env.VITE_PDF_PREVIEW_SCALE
    ),

  ENABLE_OCR:
    import.meta.env.VITE_ENABLE_OCR === 'true',
  
  DEFAULT_SPLIT_MODE:
    import.meta.env.VITE_DEFAULT_SPLIT_MODE,

  POSTHOG_KEY:
  import.meta.env.VITE_POSTHOG_KEY,

  SENTRY_DSN:
  import.meta.env.VITE_SENTRY_DSN,

  SUPABASE_URL:
  import.meta.env.VITE_SUPABASE_URL,

  SUPABASE_ANON_KEY:
  import.meta.env.VITE_SUPABASE_ANON_KEY,

  FREE_MONTHLY_PAGE_LIMIT:
  Number(
    import.meta.env
      .VITE_FREE_MONTHLY_PAGE_LIMIT
  ),

  STRIPE_PUBLISHABLE_KEY:
  import.meta.env
    .VITE_STRIPE_PUBLISHABLE_KEY,

  STRIPE_PRICE_ID:
  import.meta.env
    .VITE_STRIPE_PRICE_ID,
};