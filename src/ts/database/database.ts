import { v4 as uuidv4 } from 'uuid';

import { userType } from '../models/user.model';

export class DataBase {
  public readonly users: userType[] = [];

  public async getUsers(): Promise < userType[] > {
    return this.users; 
  }

  public async addUser(): Promise < userType > {
    const id = this.getId();
    const user = {
      id,
      username: '',
      age: 0,
      hobbies: [],
    };
    this.users.push(user);
    return user;
  }

  private getId(): string {
    let id = '';
    let isUnique = false;
    while (!isUnique) {
      id = uuidv4();
      let found = false;
      this.users.forEach(el => {
        if (el.id === id) found = true;
      });
      if (!found) isUnique = true;
    }
    return id;
  }
}
