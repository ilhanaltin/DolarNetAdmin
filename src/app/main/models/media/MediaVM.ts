
export class MediaVM
{
    id: number;
    userId: number;
    file: any;
    filePath: string;
    fileName: string;
    size: number;
    fileTypeId: number;
    fileTypeName: string;
    date: Date;

    /**
     * Constructor
     *
     * @param media
     */
    constructor(media)   
    {
        this.id = media.id || 0;
        this.userId = media.userId || 0;
        this.filePath = media.filePath || '';
        this.fileName = media.fileName || '';
        this.size = media.size || null;
        this.fileTypeId = media.fileTypeId || 1;
        this.fileTypeName = media.fileTypeName || '';
    }   
}