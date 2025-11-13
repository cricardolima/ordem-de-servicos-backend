import { App } from './app';

const app = new App();
const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;

app.start(port);
