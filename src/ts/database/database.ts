import { v4 as uuidv4 } from 'uuid';

import { userType } from '../models/user.model';

export class DataBase {
    private readonly users: userType[] = [];

    public async getUsers(): Promise < userType[] > {
      return this.users; 
    }
  
    public async findUser(id: string): Promise < userType > {
      const defaultUser = {
    
        username: '',
        age: 0,
        hobbies: [],
      };
      const users = this.users;
      const user = users.find(el => el.id === id);
      return (user) ? user : defaultUser;
    }
  
    public async createUser(newUser: userType): Promise < userType > {
      const user: userType = JSON.parse(JSON.stringify(newUser));
      user.id = this.createId();
      this.users.push(user);
      return user;
    }
  
    public async updateUser(newUser: userType): Promise < userType > {
      const updatedUser: userType = JSON.parse(JSON.stringify(newUser));
      this.users.forEach((oldUser, index) => {
        if (oldUser.id === updatedUser.id) this.users[index] = updatedUser;
      });
      return updatedUser;
    }
  
    private createId(): string {
  
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
