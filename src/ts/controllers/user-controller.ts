import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { DataBase } from '../database/database';
import { userType } from '../models/user.model';

const SERVER_ERROR_MESSAGE = 'Internal Server Error';
const REQUEST_BODY_ERROR_MESSAGE = 'Request Body Does Not Contain Required Fields';
const UUID_ERROR_MESSAGE = 'UserId Is Invalid (not uuid)';
const USER_ERROR_MESSAGE = 'UserId Is Not Found';

const sendAnswer = (response: ServerResponse, outputStatusCode: number, outputContent: string) => {
  response.writeHead(outputStatusCode, {'Content-Type': 'application/json'});
  response.end(outputContent);
}

export const getUsers = async (response: ServerResponse, database: DataBase) => {
  let outputContent = '';
  let outputStatusCode: number;
  try {
    const users: userType[] = await database.getUsers();
    outputContent = JSON.stringify(users);
    outputStatusCode = 200;
  } catch (err) {
    outputContent = JSON.stringify({message: SERVER_ERROR_MESSAGE});
    outputStatusCode = 500;
  }
  sendAnswer(response, outputStatusCode, outputContent);
}

export const getSingleUser = async (response: ServerResponse, database: DataBase, id: string) => {
  let outputContent = '';
  let outputStatusCode: number = 0;
  try {
    if (uuidValidate(id)) {
      const user: userType = await database.findUser(id);
      if (user.id) {
        outputContent = JSON.stringify(user);
        outputStatusCode = 200;
      } else {
        outputContent = JSON.stringify({message: USER_ERROR_MESSAGE});
        outputStatusCode = 404;
      }
    } else {
      outputContent = JSON.stringify({message: UUID_ERROR_MESSAGE});
      outputStatusCode = 400;
    }
  } catch (err) {
    outputContent = JSON.stringify({message: SERVER_ERROR_MESSAGE});
    outputStatusCode = 500;
  }
  sendAnswer(response, outputStatusCode, outputContent);
}

export const createUser = async (request: IncomingMessage, response: ServerResponse, database: DataBase) => {
  let outputContent = '';
  let outputStatusCode: number;
  try {
    let body = '';
    request.on('data', chunk => body += chunk.toString());

    request.on('end', async () => {
      if (body) {
        const { username, age, hobbies } = JSON.parse(body);
        if (username && age && hobbies && typeof username === 'string' && typeof age === 'number' && Array.isArray(hobbies)) {
          const newUser = {
            username,
            age,
            hobbies,
          };
          const user: userType = await database.createUser(newUser);
          outputContent = JSON.stringify(user);
          outputStatusCode = 201;
        } else {
          outputContent = JSON.stringify({message: REQUEST_BODY_ERROR_MESSAGE});
          outputStatusCode = 400;
        }
        sendAnswer(response, outputStatusCode, outputContent);
      }
    });
  } catch (err) {
    outputContent = JSON.stringify({message: SERVER_ERROR_MESSAGE});
    outputStatusCode = 500;
    sendAnswer(response, outputStatusCode, outputContent);
  }
}

export const updateSingleUser = async (request: IncomingMessage, response: ServerResponse, database: DataBase, id: string) => {
  let outputContent = '';
  let outputStatusCode: number = 0;
  try {
    let body = '';
    request.on('data', chunk => body += chunk.toString());

    request.on('end', async () => {
      if (body) {
        const { username, age, hobbies } = JSON.parse(body);
        if (username && age && hobbies && typeof username === 'string' && typeof age === 'number' && Array.isArray(hobbies)) {
          const newUser = {
            username,
            age,
            hobbies,
            id,
          };
          if (uuidValidate(id)) {
            const user: userType = await database.findUser(id);
            if (user.id) {
              const user: userType = await database.updateUser(newUser);
              outputContent = JSON.stringify(user);
              outputStatusCode = 200;
            } else {
              outputContent = JSON.stringify({message: USER_ERROR_MESSAGE});
              outputStatusCode = 404;
            }
          } else {
            outputContent = JSON.stringify({message: UUID_ERROR_MESSAGE});
            outputStatusCode = 400;
          }
        } else {
          outputContent = JSON.stringify({message: REQUEST_BODY_ERROR_MESSAGE});
          outputStatusCode = 400;
        }
        sendAnswer(response, outputStatusCode, outputContent);
      }
    });
  } catch (err) {
    outputContent = JSON.stringify({message: SERVER_ERROR_MESSAGE});
    outputStatusCode = 500;
    sendAnswer(response, outputStatusCode, outputContent);
  }
}

export const deleteSingleUser = async (response: ServerResponse, database: DataBase, id: string) => {
  let outputContent = '';
  let outputStatusCode: number = 0;
  try {
    if (uuidValidate(id)) {
      const user: userType = await database.findUser(id);
      if (user.id) {
        await database.deleteUser(user);
        outputContent = JSON.stringify('');
        outputStatusCode = 204;
      } else {
        outputContent = JSON.stringify({message: USER_ERROR_MESSAGE});
        outputStatusCode = 404;
      }
    } else {
      outputContent = JSON.stringify({message: UUID_ERROR_MESSAGE});
      outputStatusCode = 400;
    }
  } catch (err) {
    outputContent = JSON.stringify({message: SERVER_ERROR_MESSAGE});
    outputStatusCode = 500;
  }
  sendAnswer(response, outputStatusCode, outputContent);
}
