export class UserVM
{
    id: number;
    name: string;
    lastName: string;
    nickname: string;
    avatar: string;
    email: string;
    statusId: number;
    statusName: string;
    roleId: number;
    roleName: string;

    /**
     * Constructor
     *
     * @param user
     */
    constructor(user)   
    {
        {
            this.id = user.id || '100000';
            this.name = user.name || '';
            this.lastName = user.lastName || '';
            this.avatar = user.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = user.nickname || '';
            this.email = user.email || '';
            this.statusId = user.statusId || '';
            this.statusName = user.statusName || '';
            this.roleId = user.roleId || '';
            this.roleName = user.roleName || '';
        }
    }
}