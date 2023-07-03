import { createServer, IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
import os from 'os';
import cluster from 'cluster';

import { DataBase } from './database/database';
import { getUsers, createUser, getSingleUser, updateSingleUser, deleteSingleUser } from './controllers/user-controller';

const database = new DataBase(); 
const PORT = Number(process.env.PORT);
const HOSTNAME = 'localhost';
const ROUTE_ERROR_MESSAGE = 'Route Not Found';
 
const requestHandler = (request: IncomingMessage, response: ServerResponse): void => {
  const { method, url } = request;
  if (method && url) {
    if (method === 'GET' && url === '/api/users') getUsers(response, database);
    else if (method === 'GET' && url.match(/\/api\/users\/([0-9a-zA-Z-]+)/)) {
      const id = url.split('/')[3];
      getSingleUser(response, database, id);
    } else if (method === 'PUT' && url.match(/\/api\/users\/([0-9a-zA-Z-]+)/)) {
      const id = url.split('/')[3];
      updateSingleUser(request, response, database, id);
    } else if (method === 'DELETE' && url.match(/\/api\/users\/([0-9a-zA-Z-]+)/)) {
      const id = url.split('/')[3];
      deleteSingleUser(response, database, id);
    } else if (method === 'POST' && url === '/api/users') createUser(request, response, database);
    else {
      const outputContent = JSON.stringify({message: ROUTE_ERROR_MESSAGE});
         const outputStatusCode = 404;
      response.writeHead(outputStatusCode, {'Content-Type': 'application/json'});
      response.end(outputContent);
    }
  }
};

const runServer = (): void => {
  const server = createServer(requestHandler);
  server.listen(PORT, HOSTNAME, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
}

if (process.argv.length === 3 && process.argv[2] === 'multi') {
  if (cluster.isPrimary) {
    let cpus = os.cpus();
    cpus.forEach(() => {
      const worker = cluster.fork();
      worker.send(`Worker id: ${worker.id} launched`);
    });
  } else {
    runServer();
    process.on('message', message => console.log(`Message from master: "${message}"`));
  }
} else runServer();

