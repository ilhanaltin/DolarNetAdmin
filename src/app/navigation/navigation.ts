import { FuseNavigation } from '@fuse/types';

export const navigationAdmin: FuseNavigation[] = [
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
                id       : 'contact-messages',
                title    : 'İletişim Formu',
                type     : 'item',
                icon     : 'contact_support',
                url      : '/contact-messages',
            },
            {
                id       : 'blog',
                title    : 'Yazı Yönetim',
                type     : 'item',
                icon     : 'insert_drive_file',
                url      : '/posts',
            },
            {
                id       : 'file-manager',
                title    : 'Medya Yönetim',
                type     : 'item',
                icon     : 'image',
                url      : '/file-manager'
            }
        ]
    }
];

export const navigationEditor: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Uygulamalar',
        type     : 'group',
        children : [
            {
                id       : 'blog',
                title    : 'Yazı Yönetim',
                type     : 'item',
                icon     : 'search',
                url      : '/posts',
            },
            {
                id       : 'file-manager',
                title    : 'Medya Yönetim',
                type     : 'item',
                icon     : 'folder',
                url      : '/file-manager'
            }
        ]
    }
];
