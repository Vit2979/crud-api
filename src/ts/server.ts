import { createServer, IncomingMessage, ServerResponse } from 'http';
 
import { DataBase } from './database/database';
import { getUsers, addUser } from './controllers/user-controller';

const database = new DataBase(); 

const PORT = 5000;
const HOSTNAME = 'localhost';
 
const requestHandler = (request: IncomingMessage, response: ServerResponse) => {
  const { method, url } = request;
  if (method && url) {
    if (method === 'GET' && url === '/api/users') getUsers(response, database);
    else if (method === 'POST' && url === '/api/users') addUser(response, database);
    else {
      const outputContent = JSON.stringify({message: 'Route Not Found'});
      const outputStatusCode = 404;
      response.writeHead(outputStatusCode, {'Content-Type': 'application/json'});
      response.end(outputContent);
    }
  }
};

const server = createServer(requestHandler);

server.listen(PORT, HOSTNAME, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
