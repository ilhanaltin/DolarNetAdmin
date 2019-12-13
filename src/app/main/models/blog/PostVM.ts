import { PostCommentsVM } from './PostCommentsVM';
import { PostVotesVM } from './PostVotesVM';

export class PostVM
{
    id: number;
    title: string;
    authorId: number;
    authorName: string;
    authorNickName: string;
    content: string;
    publishDate: Date;
    isSliderPost: boolean;
    categoryTypeId: number;
    categoryTypeName: string;
    statusTypeId: number;
    statusTypeName: string;
    likeCount: number;
    commentCount: number;
    comments: PostCommentsVM;
    votes: PostVotesVM;
    mainImage: any;

    /**
     * Constructor
     *
     * @param post
     */
    constructor(post)   
    {
        {
            this.id = post.id || 0;
            this.title = post.title || '';
            this.authorId = post.authorId || 0;
            this.authorName = post.authorName || '';
            this.authorNickName = post.authorNickName || '';
            this.content = post.content || '';
            this.categoryTypeId = post.categoryTypeId || 0;
            this.categoryTypeName = post.categoryTypeName || '';
            this.statusTypeId = post.statusTypeId || 1;
            this.statusTypeName = post.statusTypeName || '';
            this.likeCount = post.likeCount || 0;
            this.commentCount = post.roleName || 0;
            this.comments = post.comments || [];
            this.votes = post.votes || [];
            this.mainImage = post.mainImage || '';
            this.publishDate = post.publishDate || '';
            this.isSliderPost = post.isSliderPost || false;
        }
    }
}