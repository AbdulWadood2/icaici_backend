declare namespace NodeJS {
  interface ProcessEnv {
    // app
    APPNAME: string | undefined;
    // PORT
    PORT: number | undefined;
    // swagger
    SWAGGER_USERNAME: string | undefined;
    SWAGGER_PASSWORD: string | undefined;
    // mongoose
    MONGO_URL: string | undefined;
    // crypto js
    ENCRYPTION_KEY: string | undefined;
    // jwt
    JWT_SECRET: string | undefined;
    JWT_AccessTokenExpiry: string | undefined;
    JWT_RefreshTokenExpiry: string | undefined;
  }
}
