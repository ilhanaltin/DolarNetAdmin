import { ContactVM } from './ContactVM';
import { PagingVM } from '../PagingVM';

export class ContactListResponseDetailsVM
{
    contactList: ContactVM[];
    pagingVM: PagingVM;
}