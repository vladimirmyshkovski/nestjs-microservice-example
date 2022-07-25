let opts = {};

if (process.env.NODE_ENV === 'production') {
  opts = {
    servers: [process.env.NATS_SERVER],
    queue: process.env.NATS_QUEUE,
  };
} else {
  opts = {
    host: process.env.MINIO_CLIENT_SERVICE_HOST || 'localhost',
    port: process.env.MINIO_CLIENT_SERVICE_PORT || '4002',
  };
}

export const options = opts;
