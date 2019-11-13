import { PostCommentVM } from './PostCommentVM';
import { PostVotesVM } from './PostVotesVM';

export class PostVM
{
    id: number;
    title: string;
    authorId: number;
    authorName: string;
    authorNickName: string;
    content: string;
    categoryTypeId: number;
    categoryTypeName: string;
    statusTypeId: number;
    statusTypeName: string;
    likeCount: number;
    commentCount: number;
    comments: PostCommentVM;
    votes: PostVotesVM;

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
            this.statusTypeId = post.statusTypeId || 0;
            this.statusTypeName = post.statusTypeName || '';
            this.likeCount = post.likeCount || 0;
            this.commentCount = post.roleName || 0;
            this.comments = post.comments || [];
            this.votes = post.votes || [];
        }
    }
}