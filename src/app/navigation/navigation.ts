import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Uygulamalar',
        type     : 'group',
        children : [
            {
                id       : 'users',
                title    : 'Kullanıcı Listesi',
                type     : 'item',
                icon     : 'person',
                url      : '/users',
                badge    : {
                    title    : '25',                    
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            }
        ]
    }
];
