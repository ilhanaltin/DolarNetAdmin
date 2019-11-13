import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Uygulamalar',
        type     : 'group',
        children : [
            {
                id       : 'users',
                title    : 'Kullanıcı Yönetim',
                type     : 'item',
                icon     : 'person',
                url      : '/users'
            },
            {
                id       : 'audit',
                title    : 'Log Yönetim',
                type     : 'item',
                icon     : 'search',
                url      : '/audit',
            },
            {
                id       : 'blog',
                title    : 'Yazı Yönetim',
                type     : 'item',
                icon     : 'search',
                url      : '/posts',
            }
        ]
    }
];
