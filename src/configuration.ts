export default () => ({
  port: parseInt(process.env.APP_PORT ?? '3000', 10) || 3000,
  version: process.env.APP_VERSION ?? '0.1.0',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '3000', 10) || 3000,
  },
  cloudinary: {
    name: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});
