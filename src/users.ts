export interface User {

    id: number;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    city: string;
    phone: string;
  }
  
  export const users: User[] = [];
  