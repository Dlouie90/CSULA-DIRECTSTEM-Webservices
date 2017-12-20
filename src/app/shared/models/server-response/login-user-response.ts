import {User} from '../user.model';

export class LoginUserResponse {
  constructor(public email: string, public password: string, public user: User, public successful: boolean) {
  }
}
