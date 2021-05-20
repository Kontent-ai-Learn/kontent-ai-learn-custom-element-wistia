import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IWistiaVideo, VideoPreviewType } from '../models/wistia.models';

declare const CustomElement: any;

interface IElementInit {
    isDisabled: boolean;
    value?: IWistiaVideo;
    accessToken?: string;
    subdomain?: string;
    videoPreviewType?: VideoPreviewType;
    videosPerRow?: string;
    projectsPerRow?: string;
    pageSize?: string;
}

@Injectable({ providedIn: 'root' })
export class KontentService {
    public disabledChanged = new Subject<boolean>();
    private initialized: boolean = false;

    constructor() {}

    initCustomElement(onInit: (data: IElementInit) => void, onError: (error: any) => void): void {
        try {
            CustomElement.init((element: any, context: any) => {
                CustomElement.onDisabledChanged((disabled: boolean) => {
                    this.disabledChanged.next(disabled);
                });

                onInit({
                    value: element.value ? this.parseExistingValue(element.value) : undefined,
                    isDisabled: element.disabled,
                    accessToken: element.config.wistiaAccessToken,
                    subdomain: element.config.wistiaSubdomain,
                    videoPreviewType: element.config.videoPreviewType ? this.mapVideoPreviewType(element.config.videoPreviewType) : undefined,
                    videosPerRow: element.config.videosPerRow,
                    projectsPerRow: element.config.projectsPerRow,
                    pageSize: element.config.pageSize,
                });

                this.initialized = true;
            });
        } catch (error) {
            onError(error);
        }
    }

    setValue(value?: IWistiaVideo): void {
        if (this.initialized) {
            CustomElement.setValue(value ? JSON.stringify(value) : null);
        }
    }

    updateSizeToMatchHtml(height: number): void {
        if (this.initialized) {
            CustomElement.setHeight(height);
        }
    }

    private mapVideoPreviewType(value?: string): VideoPreviewType | undefined {
        if (!value) {
            return undefined;
        }

        if (value.toLowerCase() === <VideoPreviewType>('thumbnail')) {
            return 'thumbnail';
        }

        return 'video';
    }

    private parseExistingValue(value: any): IWistiaVideo {
        try {
            return JSON.parse(value);
        } catch (err) {
            throw new Error(`Could not parse element value`);
        }
    }
}
