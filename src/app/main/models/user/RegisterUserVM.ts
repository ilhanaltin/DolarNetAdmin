export class RegisterUserVM
{
    name: string;
    lastName: string;
    nickName: string;
    avatar: any;
    email: string;
    password: string;
    passwordConfirm: string;
    roleId: number;

    /**
     * Constructor
     *
     * @param user
     */
    constructor(user)   
    {
        {
            this.name = user.name || '';
            this.lastName = user.lastName || '';
            this.avatar = user.avatar || 'assets/images/avatars/profile.jpg';
            this.nickName = user.nickName || '';
            this.email = user.email || '';
            this.password = user.password || '';
            this.passwordConfirm = user.passwordConfirm || '';
            this.roleId = user.roleId || 0;
        }
    }
}