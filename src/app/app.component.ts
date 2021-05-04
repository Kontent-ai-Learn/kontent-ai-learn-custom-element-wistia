import { ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CoreComponent } from './core/core.component';
import { IWistiaProject, IWistiaVideo } from './models/wistia.models';
import { WistiaService } from './services/wistia.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends CoreComponent implements OnInit {
    private wistia: any;

    public readonly wistiaTokenVariable: string = 'WistiaToken';

    public readonly accessToken?: string = this.getAccessToken();

    public readonly dropInElementId: string = 'WistiaUploaderElem';

    public showUploader: boolean = false;
    public projects: IWistiaProject[] = [];
    public selectedProject?: IWistiaProject;

    public loading: boolean = false;

    public projectsPerRow: number = 3;
    public projectsPerRowGap: string = '24px';

    public videosPerRow: number = 4;
    public videosPerRowGap: string = '24px';

    public showLoadMoreVideos: boolean = false;
    private pageSize: number = 8;
    public selectedVideo?: IWistiaVideo;
    public videosPage: number = 1;
    public videos: IWistiaVideo[] = [];
    public currentSearch?: string;

    public searchControl: FormControl = new FormControl();

    constructor(private wistiaService: WistiaService, cdr: ChangeDetectorRef) {
        super(cdr);
        this.wistia = (window as any).Wistia;
        (window as any)._wapiq = (window as any)._wapiq || [];
    }

    ngOnInit(): void {
        this.initSearch();

        // const currentVideoId: string | undefined = '72634383';
        const currentVideoId: string | undefined = undefined;

        if (this.accessToken) {
            this.initProjects(this.accessToken, currentVideoId);
        }
    }

    handleHideUploader(): void {
        this.showUploader = false;
    }

    handleShowUploader(): void {
        if (!this.accessToken || !this.selectedProject) {
            return;
        }
        this.initUploader(this.dropInElementId, this.accessToken, this.selectedProject.id);
    }

    handleLoadMoreVideos(): void {
        if (!this.accessToken || !this.selectedProject) {
            return;
        }
        this.videosPage++;
        this.loadVideos(this.accessToken, this.selectedProject.id, this.pageSize, this.videosPage, this.currentSearch);
    }

    handleUnselectProject(): void {
        this.selectedProject = undefined;
        this.videos = [];
        this.videosPage = 1;
        this.currentSearch = undefined;
    }

    handleSelectProject(project: IWistiaProject): void {
        if (!this.accessToken) {
            return;
        }
        this.selectedProject = project;
        this.videos = [];
        this.videosPage = 1;

        this.loadVideos(this.accessToken, project.id, this.pageSize, this.videosPage, this.currentSearch);
    }

    handleSelectVideo(video: IWistiaVideo): void {
        this.selectedVideo = video;
    }

    getVideoDate(video: IWistiaVideo): string {
        return new Date(video.updated).toLocaleDateString();
    }

    handleClearSelectedVideo(): void {
        this.selectedVideo = undefined;
    }

    private initSearch(): void {
        super.subscribeToObservable(
            this.searchControl.valueChanges.pipe(
                debounceTime(150),
                switchMap((value) => {
                    this.videosPage = 1;
                    this.currentSearch = value;

                    if (this.accessToken && this.selectedProject) {
                        return this.wistiaService
                            .listVideos(
                                this.accessToken,
                                this.selectedProject.id,
                                this.pageSize,
                                this.videosPage,
                                this.currentSearch
                            )
                            .pipe(
                                map((videos) => {
                                    this.videos = videos;
                                    super.markForCheck();
                                })
                            );
                    }

                    return of(undefined);
                }),
                map((value) => {
                    super.markForCheck();
                })
            )
        );
    }

    private loadVideos(
        accessToken: string,
        projectId: string,
        pageSize: number,
        page: number,
        search: string | undefined
    ): void {
        super.subscribeToObservable(
            this.wistiaService.listVideos(accessToken, projectId, pageSize, page, search).pipe(
                map((videos) => {
                    this.videos.push(...videos);

                    if (videos.length) {
                        this.showLoadMoreVideos = true;
                    } else {
                        this.showLoadMoreVideos = false;
                    }

                    super.markForCheck();
                })
            )
        );
    }

    private initUploader(elementId: string, accessToken: string, projectId: string): void {
        this.showUploader = true;
        (window as any)._wapiq.push((W: any) => {
            (window as any).wistiaUploader = new W.Uploader({
                accessToken,
                dropIn: elementId,
                projectId
            });
        });
    }

    private initProjects(accessToken: string, currentVideoId?: string): void {
        this.loading = true;
        super.subscribeToObservable(
            this.wistiaService.listProjects(accessToken).pipe(
                switchMap((projects) => {
                    this.projects = projects.sort((b, a) => {
                        if (a.name < b.name) {
                            return -1;
                        }
                        if (a.name > b.name) {
                            return 1;
                        }
                        return 0;
                    });

                    if (!currentVideoId) {
                        return of(undefined);
                    }

                    return this.wistiaService.videoInfo(accessToken, currentVideoId).pipe(
                        map((video) => {
                            const candidateProject = this.projects.find((m) => m.id === video.project.id);

                            if (candidateProject) {
                                this.selectedProject = candidateProject;
                            }

                            this.selectedVideo = video;
                        })
                    );
                }),
                map(() => {
                    this.loading = false;
                    super.markForCheck();
                })
            )
        );
    }

    private getAccessToken(): string | undefined {
        // get variables from kontent custom element configuration in production
        if (environment.production) {
            return '';
        }

        return environment.wistia.accessToken;
    }
}
