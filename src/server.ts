import { app } from './app';
import { env } from './env';

app.listen(
  {
    port: env.PORT,
    host: '0.0.0',
  },
  () => console.log(`Server has started at ${env.PORT}`)
);
