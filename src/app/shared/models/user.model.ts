export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  description: string;

  constructor(properties?: any) {
    if (!properties) {
      return;
    }

    this.id = properties.id;
    this.firstName = properties.firstName;
    this.lastName = properties.lastName;
    this.email = properties.email;
    this.password = properties.password;
    this.description = properties.description;
  }
}
