export class UserVM
{
    id: number;
    name: string;
    lastName: string;
    nickName: string;
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
            this.id = user.id || 0;
            this.name = user.name || '';
            this.lastName = user.lastName || '';
            this.avatar = user.avatar || 'Images/Profile/profile-empty.jpg';
            this.nickName = user.nickName || '';
            this.email = user.email || '';
            this.statusId = user.statusId || '';
            this.statusName = user.statusName || '';
            this.roleId = user.roleId || 0;
            this.roleName = user.roleName || '';
        }
    }
}