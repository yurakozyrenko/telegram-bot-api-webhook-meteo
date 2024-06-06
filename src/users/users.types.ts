import { User } from './entity/users.entity';
import { UserActions } from './users.constants';

export type TUsersActions = {
  [key in UserActions]: (text: string, user: User) => Promise<void>;
};
