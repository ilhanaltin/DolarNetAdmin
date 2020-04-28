import { PagingVM } from '../PagingVM';
import { MediaVM } from './MediaVM';

export class MediaListResponseDetailsVM
{
    mediaList: MediaVM[];
    pagingVM: PagingVM;  
}