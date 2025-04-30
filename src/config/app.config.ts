import packgeJson from '../../package.json' assert { type: 'json' }

export const AppConfig = {
  APP_NAME: packgeJson.name,
  APP_VERSION: packgeJson.version,
  APP_ENV: import.meta.env.MODE ?? 'development',
  API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  API_URL_SOCKET: import.meta.env.VITE_API_URL_SOCKET ?? 'http://localhost:8080'
}
