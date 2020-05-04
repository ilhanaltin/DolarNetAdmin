import { PostCommentVM } from './PostCommentVM';
import { PostVotesVM } from './PostVotesVM';
import { MatChipInputEvent } from '@angular/material/chips';

export class PostVM
{
    id: number;
    title: string;
    longTitle: string;
    tags: string[];
    authorId: number;
    authorName: string;
    authorNickName: string;
    content: string;
    publishDate: Date;
    isSliderPost: boolean;
    categoryIds: number[];
    categoryNames: string;
    statusTypeId: number;
    statusTypeName: string;
    likeCount: number;
    commentCount: number;
    readCount: number;
    comments: PostCommentVM;
    votes: PostVotesVM;
    imagePath: string;

    /**
     * Constructor
     *
     * @param post
     */
    constructor(post)   
    {
        this.id = post.id || 0;
        this.title = post.title || '';
        this.longTitle = post.longTitle || '';
        this.tags = post.tags || [];
        this.authorId = post.authorId || 0;
        this.authorName = post.authorName || '';
        this.authorNickName = post.authorNickName || '';
        this.content = post.content || '';
        this.categoryIds = post.categoryIds || null;
        this.categoryNames = post.categoryNames || '';
        this.statusTypeId = post.statusTypeId || 1;
        this.statusTypeName = post.statusTypeName || '';
        this.likeCount = post.likeCount || 0;
        this.commentCount = post.commentCount || 0;
        this.readCount = post.readCount || 0;
        this.comments = post.comments || [];
        this.votes = post.votes || [];
        this.imagePath = post.imagePath || '';
        this.publishDate = post.publishDate || '';
        this.isSliderPost = post.isSliderPost || false;
    }

    /**
     * Add tag
     *
     * @param {MatChipInputEvent} event
     */
    addTag(event: MatChipInputEvent): void
    {
        const input = event.input;
        const value = event.value;

        // Add tag
        if ( value )
        {
            this.tags.push(value);
        }

        // Reset the input value
        if ( input )
        {
            input.value = '';
        }
    }

    /**
     * Remove tag
     *
     * @param tag
     */
    removeTag(tag): void
    {
        const index = this.tags.indexOf(tag);

        if ( index >= 0 )
        {
            this.tags.splice(index, 1);
        }
    }
}