import { ServerResponse } from 'http';

import { DataBase } from '../database/database';
import { userType } from '../models/user.model';

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
    outputContent = JSON.stringify({message: 'Errors on the server side'});
    outputStatusCode = 500;
  }
  sendAnswer(response, outputStatusCode, outputContent);
}

export const addUser = async (response: ServerResponse, database: DataBase) => {
  let outputContent = '';
  let outputStatusCode: number;
  try {
    const user: userType = await database.addUser();
    outputContent = JSON.stringify(user);
    outputStatusCode = 201;
  } catch (err) {
    outputContent = JSON.stringify({message: 'Errors on the server side'});
    outputStatusCode = 500;
  }
  sendAnswer(response, outputStatusCode, outputContent);
}