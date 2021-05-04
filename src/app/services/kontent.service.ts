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

    constructor() {}

    initCustomElement(onInit: (data: IElementInit) => void): void {
        CustomElement.init((element: any, context: any) => {
            console.log(element);
            onInit({
                value: element.value,
                isDisabled: element.disabled,
                accessToken: element.config.wistiaAccessToken
            });
        });

        CustomElement.onDisabledChanged((disabled: boolean) => {
            this.disabledChanged.next(disabled);
        });
    }

    setValue(value?: string): void {
        CustomElement.setValue(value ?? null);
    }

    updateSizeToMatchHtml(height: number): void {
        CustomElement.setHeight(height);
    }
}
