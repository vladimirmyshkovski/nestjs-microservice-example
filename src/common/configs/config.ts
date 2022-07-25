import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: parseInt(process.env.MINIO_CLIENT_SERVICE_PORT),
  },
  cors: {
    enabled: true,
  },
  security: {
    expiresIn: '1d',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
