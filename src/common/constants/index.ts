let MINIO_BASE_URL = '';
if (process.env.MINIO_PORT) {
  MINIO_BASE_URL = `${process.env.MINIO_PROTOCOL}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;
} else {
  MINIO_BASE_URL = `${process.env.MINIO_PROTOCOL}://${process.env.MINIO_ENDPOINT}`;
}

const FRONTEND_BASE_URL =
  process.env.FRONTEND_BASE_URL || 'http://localhost:9000/';

export { MINIO_BASE_URL, FRONTEND_BASE_URL };
