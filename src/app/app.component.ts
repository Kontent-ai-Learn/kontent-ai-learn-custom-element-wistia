import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CoreComponent } from './core/core.component';
import { IWistiaProject, IWistiaVideo, VideoPreviewType } from './models/wistia.models';
import { KontentService } from './services/kontent.service';
import { WistiaService } from './services/wistia.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends CoreComponent implements OnInit, AfterViewChecked {
    // readonly setup
    private readonly pageSize: number = 9;

    public readonly wistiaTokenVariable: string = 'wistiaAccessToken';
    public readonly dropInElementId: string = 'WistiaUploaderElem';

    // config
    public accessToken?: string;
    public wistiaSubdomain?: string = 'xxx';
    public videoPreviewType: VideoPreviewType = 'video';
    public videosPerRow: number = 3;
    public projectsPerRow: number = 3;

    // base
    public loading: boolean = true;
    public isDisabled: boolean = true;
    public initialized: boolean = false;
    public errorMessage?: string;

    // uploader
    public showUploader: boolean = false;

    // projects
    public projects: IWistiaProject[] = [];
    public selectedProject?: IWistiaProject;
    public projectsPerRowGap: string = '24px';

    // videos
    public showFileNotFoundError: boolean = false;
    public showFileNotSelected: boolean = false;
    public videosPerRowGap: string = '24px';
    public showLoadMoreVideos: boolean = false;
    public selectedVideo?: IWistiaVideo;
    public videosPage: number = 1;
    public videos: IWistiaVideo[] = [];
    public currentSearch?: string;
    public searchControl: FormControl = new FormControl();

    public get selectedVideoEditUrl(): string | undefined {
        if (!this.selectedVideo || !this.wistiaSubdomain) {
            return undefined;
        }

        return this.wistiaService.getVideoEditUrl(this.wistiaSubdomain, this.selectedVideo);
    }

    public get showProjectInformation(): boolean {
        if (this.selectedVideo) {
            return false;
        }
        return true;
    }

    public get showProjectSelection(): boolean {
        if (!this.selectedProject && !this.selectedVideo) {
            return true;
        }
        return false;
    }

    constructor(private wistiaService: WistiaService, private kontentService: KontentService, cdr: ChangeDetectorRef) {
        super(cdr);
    }

    ngOnInit(): void {
        this.initSearch();
        this.initDisabledChanged();

        if (this.isKontentContext()) {
            this.kontentService.initCustomElement(
                (data) => {
                    if (data.accessToken) {
                        this.accessToken = data.accessToken;
                        this.wistiaSubdomain = data.subdomain;
                        this.isDisabled = data.isDisabled;

                        if (data.videoPreviewType) {
                            this.videoPreviewType = data.videoPreviewType;
                        }

                        if (data.projectsPerRow) {
                            this.projectsPerRow = +data.projectsPerRow;
                        }

                        if (data.videosPerRow) {
                            this.videosPerRow = +data.videosPerRow;
                        }

                        this.initialized = true;

                        super.detectChanges();

                        const currentVideoId = data.value?.hashed_id;

                        if (currentVideoId) {
                            super.subscribeToObservable(this.initVideoObs(data.accessToken, currentVideoId));
                        }
                    }
                },
                (error) => {
                    this.initialized = true;
                    this.loading = false;
                    console.error(error);
                    this.errorMessage = `Could not initialize custom element. Custom elements can only be embedded in an iframe`;
                    super.detectChanges();
                }
            );
        } else {
            this.accessToken = this.getDefaultAccessToken();
            this.isDisabled = false;
            this.initialized = true;

            if (this.accessToken) {
                const defaultVideoId = this.getDefaultFileId();

                if (defaultVideoId) {
                    super.subscribeToObservable(this.initVideoObs(this.accessToken, defaultVideoId));
                } else {
                    super.subscribeToObservable(this.initProjectsObs(this.accessToken, this.selectedProject?.id));
                }
            } else {
                this.loading = false;
            }
        }
    }

    ngAfterViewChecked(): void {
        // update size of Kontent UI
        if (this.isKontentContext()) {
            // this is required because otherwise the offsetHeight can return 0 in some circumstances
            // https://stackoverflow.com/questions/294250/how-do-i-retrieve-an-html-elements-actual-width-and-height
            setTimeout(() => {
                const htmlElement = document.getElementById('htmlElem');
                if (htmlElement) {
                    const height = htmlElement.offsetHeight;
                    this.kontentService.updateSizeToMatchHtml(height);
                }
            }, 50);
        }
    }

    handleBackToListing(): void {
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
        this.showUploader = false;
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
        this.setSelectedVideo(video);
    }

    getVideoDate(video: IWistiaVideo): string {
        return new Date(video.updated).toLocaleDateString();
    }

    handleClearSelectedVideo(): void {
        this.setSelectedVideo(undefined);
    }

    formatVideoDuration(video: IWistiaVideo): string {
        const hhMMss = new Date(video.duration * 1000).toISOString().substr(11, 8);

        if (hhMMss.startsWith('00:')) {
            return hhMMss.substr(3, hhMMss.length - 3);
        }

        return hhMMss;
    }

    getWistiaEmbedClassForVideo(video: IWistiaVideo): string {
        return `wistia_embed wistia_async_${video.hashed_id}`;
    }

    private setSelectedVideo(video: IWistiaVideo | undefined): void {
        this.selectedVideo = video;
        this.showFileNotFoundError = false;
        this.selectedProject = undefined;

        if (this.isKontentContext()) {
            this.kontentService.setValue(video);
        }

        if (this.accessToken) {
            super.subscribeToObservable(this.initProjectsObs(this.accessToken));
        }
    }

    private initDisabledChanged(): void {
        super.subscribeToObservable(
            this.kontentService.disabledChanged.pipe(
                map((disabled) => {
                    this.isDisabled = disabled;
                    super.detectChanges();
                })
            )
        );
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
                                map((videosResponse) => {
                                    this.videos = videosResponse.videos;
                                    this.showLoadMoreVideos = videosResponse.hasMoreItems;
                                    super.detectChanges();
                                })
                            );
                    }

                    return of(undefined);
                }),
                map((value) => {
                    super.detectChanges();
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
                map((videosResponse) => {
                    this.videos.push(...videosResponse.videos);
                    this.showLoadMoreVideos = videosResponse.hasMoreItems;

                    super.detectChanges();
                })
            )
        );
    }

    private initUploader(elementId: string, accessToken: string, projectId: string): void {
        this.showUploader = true;
        (window as any)._wapiq = (window as any)._wapiq || [];
        (window as any)._wapiq.push((W: any) => {
            const uploader = new W.Uploader({
                accessToken,
                dropIn: elementId,
                projectId
            });
            (window as any).wistiaUploader = uploader;

            uploader.bind('uploadsuccess', (file: any, media: any) => {
                // reload videos & projects as the number of files changed
                console.log('Upload successful', file, media);
                this.reloadProjects();
                this.reloadVideos();
            });
        });
    }

    private reloadProjects(): void {
        if (this.accessToken) {
            super.subscribeToObservable(this.initProjectsObs(this.accessToken, this.selectedProject?.id));
        }
    }

    private reloadVideos(): void {
        if (!this.accessToken || !this.selectedProject) {
            return;
        }
        this.videos = [];
        this.videosPage = 1;
        this.loadVideos(this.accessToken, this.selectedProject.id, this.pageSize, this.videosPage, this.currentSearch);
    }

    private initVideoObs(accessToken: string, videoId: string): Observable<void> {
        return this.wistiaService.videoInfo(accessToken, videoId).pipe(
            map((video) => {
                this.selectedVideo = video;

                super.detectChanges();
            }),
            catchError((error) => {
                this.showFileNotFoundError = true;
                console.warn(`Could not load video with id '${videoId}'`);
                console.error(error);

                super.detectChanges();

                return of(undefined);
            })
        );
    }

    private initProjectsObs(accessToken: string, selectedProjectId?: string): Observable<void> {
        return this.wistiaService.listProjects(accessToken).pipe(
            map((projects) => {
                this.projects = projects.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                });
            }),
            switchMap(() => {
                if (selectedProjectId) {
                    // init media from the same project as is video
                    return this.wistiaService
                        .listVideos(accessToken, selectedProjectId, this.pageSize, this.videosPage, this.currentSearch)
                        .pipe(
                            map((videosResponse) => {
                                this.videos = videosResponse.videos;
                                this.showLoadMoreVideos = videosResponse.hasMoreItems;
                            })
                        );
                }

                return of(undefined);
            }),
            map(() => {
                super.detectChanges();
            })
        );
    }

    private getDefaultAccessToken(): string | undefined {
        if (this.isKontentContext()) {
            return undefined;
        }

        return environment.wistia.accessToken;
    }

    private getDefaultFileId(): string | undefined {
        if (this.isKontentContext()) {
            return undefined;
        }

        return environment.wistia.defaultFileId;
    }

    private isKontentContext(): boolean {
        return environment.production;
    }
}
