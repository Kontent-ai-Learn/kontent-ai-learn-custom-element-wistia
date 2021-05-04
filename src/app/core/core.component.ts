import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
export abstract class CoreComponent implements OnDestroy {
    protected readonly ngUnsubscribe_: Subject<void> = new Subject<void>();

    constructor(protected cdr: ChangeDetectorRef) {}

    ngOnDestroy(): void {
        this.ngUnsubscribe_.next();
        this.ngUnsubscribe_.complete();
    }

    detectChanges(): void {
        this.cdr.detectChanges();
    }

    markForCheck(): void {
        this.cdr.markForCheck();
    }

    protected subscribeToObservable(observable: Observable<any>): void {
        observable.pipe(takeUntil(this.ngUnsubscribe_)).subscribe();
    }
}
