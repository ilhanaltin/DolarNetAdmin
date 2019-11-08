export class PagingVM
{
    totalCount: number;
    totalPage: number;
    currentPage: number;
    pageItemCount: number;      
    
    /**
     * Constructor
     *
     * @param paging
     */
    constructor(paging)   
    {
        {
            this.totalCount = paging.totalCount || 0;
            this.totalPage = paging.totalPage || 0;
            this.currentPage = paging.currentPage || 0;
            this.pageItemCount = paging.pageItemCount || 10;
        }
    }
}