import { NgModule, DEFAULT_CURRENCY_CODE } from "@angular/core";
import { FormsModule , ReactiveFormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from './components/header/header.component';
import { DetailComponent } from './components/detail/detail.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './components/auth/auth.component';
import { ListComponent } from './components/list/list.component';
import { AddProfileComponent } from './components/add-profile/add-profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import {BrowserTransferStateModule} from '@angular/platform-browser'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortableDirective } from './directives/sortable.directive';
import { CommonModule, DecimalPipe } from '@angular/common';
@NgModule({
    declarations:[AppComponent, HeaderComponent, DetailComponent, AuthComponent, ListComponent, AddProfileComponent, SignupComponent, SortableDirective],
    imports:
    [
        BrowserModule ,
        BrowserTransferStateModule,
        CommonModule,
        FormsModule,
        AppRoutingModule ,
        HttpClientModule ,
        ReactiveFormsModule,
        NgxDocViewerModule,
        NgbModule
    ],
    providers: [{provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR'} , DecimalPipe],
    entryComponents: [
        DetailComponent,
        AddProfileComponent
    ],
    bootstrap:[AppComponent]
})
export class AppModule{}
