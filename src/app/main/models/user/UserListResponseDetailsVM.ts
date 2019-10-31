import { PagingVM } from '../PagingVM';
import { UserVM } from './UserVM';

export class UserListResponseDetailsVM
{
    userList: UserVM [];
    pagingVM: PagingVM;    
}