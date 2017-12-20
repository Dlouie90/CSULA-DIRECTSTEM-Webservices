import {User} from '../user.model';

export class CreateUserResponse {
  constructor(public user: User, public successful: boolean) {}
}
