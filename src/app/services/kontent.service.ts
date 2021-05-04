import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare const CustomElement: any;

interface IElementInit {
    value: string;
    isDisabled: boolean;
    accessToken?: string;
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
                    value: element.value,
                    isDisabled: element.disabled,
                    accessToken: element.config.wistiaAccessToken
                });

                this.initialized = true;
            });
        } catch (error) {
            onError(error);
        }
    }

    setValue(value?: string): void {
        if (this.initialized) {
            CustomElement.setValue(value ?? null);
        }
    }

    updateSizeToMatchHtml(height: number): void {
        if (this.initialized) {
            CustomElement.setHeight(height);
        }
    }
}
