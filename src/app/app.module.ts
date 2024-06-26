import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TitleComponent } from '../component/title/title.component';
import { InfoComponent } from '../component/info/info.component';
import { DetailComponent } from 'src/app/pages/detail/detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PieChartModule } from '@swimlane/ngx-charts';
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from 'src/component/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    TitleComponent,
    InfoComponent,
    DetailComponent,
    HeaderComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    PieChartModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
})
export class AppModule {}
