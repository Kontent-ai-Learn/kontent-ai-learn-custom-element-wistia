import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    private wistia: any;

    private readonly accessToken: string = 'a4b478f8e6e9251d683fd4399715ebc7775344700b54ea5e01894d128de34bae';
    private readonly projectId: string = '7zn7cu096m';

    public readonly dropInElementId: string = 'WistiaUploaderElem';

    constructor() {
        console.log(window);
        this.wistia = (window as any).Wistia;

        (window as any)._wapiq = (window as any)._wapiq || [];

        (window as any)._wapiq.push((W: any) => {
            (window as any).wistiaUploader = new W.Uploader({
                accessToken: this.accessToken,
                dropIn: this.dropInElementId,
                projectId: this.projectId
            });
        });
    }

    ngOnInit(): void {
        console.log(this.wistia);
    }
}
