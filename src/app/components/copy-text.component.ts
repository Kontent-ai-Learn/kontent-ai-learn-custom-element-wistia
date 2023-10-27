import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { CoreComponent } from '../core/core.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'lib-copy-text',
    templateUrl: 'copy-text.component.html'
})
export class CopyTextComponent extends CoreComponent {
    @Input() text?: string;

    public copied: boolean = false;

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }

    handleCopyText(): void {
        if (this.text) {
            this.copyMessage(this.text);
            this.copied = true;

            setTimeout(() => {
                this.copied = false;
                super.markForCheck();
            }, 2000);
        }
    }

    copyMessage(val: string): void {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
}
