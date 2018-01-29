import {User} from '../user.model';

export class GetUserByIdResponse {
  id: number;
  user: User;
  success: boolean;
}
