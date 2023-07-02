import { createServer, IncomingMessage, ServerResponse } from 'http';
 
const PORT = 5000;
const HOSTNAME = 'localhost';
 
const requestHandler = (request: IncomingMessage, response: ServerResponse) => {
  const { method, url } = request;
  console.log(`Получен ${method}-запрос на ${url}`);
  response.write('Hello Node.js!');
  response.end('\nBye!');
};

const server = createServer(requestHandler);

server.listen(PORT, HOSTNAME, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

