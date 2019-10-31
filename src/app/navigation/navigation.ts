import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        type     : 'group',
        children : [
            {
                id       : 'userlist',
                title    : 'Kullanıcı Listesi',
                type     : 'item',
                icon     : 'email',
                url      : '/user-list',
                badge    : {
                    title    : '25',                    
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            }
        ]
    }
];
