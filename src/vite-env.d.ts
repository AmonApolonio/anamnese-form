/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STYLE_ANALYSIS_URL: string;
  readonly VITE_REMOVE_BACKGROUND_URL: string;
  readonly VITE_REMOVE_BACKGROUND_POLL_URL: string;
  readonly VITE_COLOR_ANALYSIS_URL: string;
  readonly VITE_COLOR_ANALYSIS_POLL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
