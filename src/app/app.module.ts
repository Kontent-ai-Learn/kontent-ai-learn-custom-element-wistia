import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppFlexModule } from './flex';
import { LineClampDirective } from './core/line-clamp.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CopyTextComponent } from './components/copy-text.component';

@NgModule({
    declarations: [AppComponent, LineClampDirective, CopyTextComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppFlexModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
