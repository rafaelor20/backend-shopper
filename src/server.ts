import dotenv from 'dotenv';
import app, { init } from './app';

dotenv.config();

const port = process.env.PORT ?? 5000;

init().then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });
});
