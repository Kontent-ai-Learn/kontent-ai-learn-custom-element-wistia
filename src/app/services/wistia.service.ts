import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IWistiaProject, IWistiaVideo, IWistiaVideosResponse } from '../models/wistia.models';

export type WistiaAction = 'projects' | 'medias';

export type WistiaSort = 'name' | 'updated' | 'created';
export type WistiaSortDirection = 'asc' | 'desc';

@Injectable({ providedIn: 'root' })
export class WistiaService {
    constructor(private httpClient: HttpClient) {}

    getVideoEditUrl(subdomain: string, video: IWistiaVideo): string {
        return `https://${subdomain}.wistia.com/medias/${video.hashed_id}`;
    }

    listProjects(accessToken: string): Observable<IWistiaProject[]> {
        return this.httpClient.get<IWistiaProject[]>(this.getUrl('projects', accessToken)).pipe(
            map((response) => {
                return response;
            })
        );
    }

    videoInfo(accessToken: string, videoId: string): Observable<IWistiaVideo> {
        return this.httpClient.get<IWistiaVideo>(`${this.getUrl('medias', accessToken, `/${videoId}`)}`).pipe(
            map((response) => {
                return response;
            })
        );
    }

    listVideos(
        accessToken: string,
        projectId: string,
        pageSize: number,
        page: number,
        sort: WistiaSort,
        sortDirection: WistiaSortDirection,
        search?: string
    ): Observable<IWistiaVideosResponse> {
        let url = `${this.getUrl(
            'medias',
            accessToken
        )}&project_id=${projectId}&type=video&sort_by=${sort}&sort_direction=${
            sortDirection === 'asc' ? 1 : 0
        }&page=${page}&per_page=${pageSize}`;

        if (search) {
            url += `&name=${search}`;
        }

        return this.httpClient.get<IWistiaVideo[]>(url).pipe(
            map((response) => {
                const videoResponse: IWistiaVideosResponse = {
                    videos: response
                };

                return videoResponse;
            })
        );
    }

    private getUrl(action: WistiaAction, accessToken: string, actionPostFix?: string): string {
        return `https://api.wistia.com/v1/${action}${
            actionPostFix ? actionPostFix : ''
        }.json?access_token=${accessToken}`;
    }
}
