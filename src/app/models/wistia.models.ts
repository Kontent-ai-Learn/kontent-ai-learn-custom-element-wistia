export interface IWistiaProject {
    id: string;
    name: string;
    description?: string;
    mediaCount: number;
}

export interface IWistiaVideoAsset {
    url: string;
    width: number;
    height: number;
    fileSize: number;
    contentType: string;
    type: string;
}

export interface IWistiaVideo {
    id: number;
    hashed_id: string;
    name: string;
    progress: number;
    status: string;
    description?: string;
    created: string;
    updated: string;
    duration: number;
    type: string;
    thumbnail: {
        url: string;
        width: number;
        height: number;
    };
    project: {
        id: string;
        name: string;
    };
    assets: IWistiaVideoAsset[];
}

export interface IWistiaVideosResponse {
    hasMoreItems: boolean;
    videos: IWistiaVideo[];
}
