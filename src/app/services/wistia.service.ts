import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IWistiaProject, IWistiaVideo } from '../models/wistia.models';

export type WistiaAction = 'projects' | 'medias';

@Injectable({ providedIn: 'root' })
export class WistiaService {
    private wistia: any;

    constructor(private httpClient: HttpClient) {
        this.wistia = (window as any).Wistia;
    }

    listProjects(accessToken: string): Observable<IWistiaProject[]> {
        return this.httpClient.get<IWistiaProject[]>(this.getUrl('projects', accessToken)).pipe(
            map((response) => {
                return response;
            })
        );
    }

    listVideos(accessToken: string, projectId: string, pageSize: number, page: number, search?: string): Observable<IWistiaVideo[]> {
        let url = `${this.getUrl('medias', accessToken)}&project_id=${projectId}&type=video&sort_by=updated&page=${page}&per_page=${pageSize}`;

        if (search) {
            url += `&name=${search}`;
        }

        return this.httpClient.get<IWistiaVideo[]>(url).pipe(
            map((response) => {
                return response;
            })
        );
    }

    private getUrl(action: WistiaAction, accessToken: string): string {
        return `https://api.wistia.com/v1/${action}.json?access_token=${accessToken}`;
    }
}
