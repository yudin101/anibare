declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    FRONTEND_URL: string;
    SERVER_URL: string;
    SERVER_PORT: string;
  }
}
