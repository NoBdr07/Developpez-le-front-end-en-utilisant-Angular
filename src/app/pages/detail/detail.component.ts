import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, map, Subscription, fromEvent } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {}

  // Management of subscriptions
  private subscriptions: Subscription[] = [];

  // Page initialization
  country!: string;
  pageTitle!: string;
  windowWidth = window.innerWidth <= 500 ? window.innerWidth : window.innerWidth / 2;
  windowHeight = window.innerWidth <= 500 ? window.innerHeight - 200 : window.innerHeight - 100;

  private updateWindowSize(): void {
    const isSmallScreen = window.innerWidth <= 500;
    this.windowWidth = isSmallScreen ? window.innerWidth : window.innerWidth / 2;
    this.windowHeight = isSmallScreen ? window.innerHeight - 200 : window.innerHeight - 100;
  }

  // Data initialization for the info bubbles
  entriesLabel = 'Number of entries';
  numberOfEntries!: number;
  medalsLabel = 'Total number medals';
  numberOfMedals!: number;
  athletesLabel = 'Total number of athletes';
  numberOfAthletes!: number;

  // Observable initialization
  public olympics$: Observable<Olympic[]> = of([]);
  public medalsPerYear$: Observable<
    { name: string; series: { name: string; value: number }[] }[]
  > = of([]);

  // Line chart options
  legend: boolean = false;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  tooltipDisabled: boolean = true;
  xScaleMax: number = 5;
  xScaleMin: number = 3;
  yScaleMax: number = 150;
  yScaleMin: number = 0;

  ngOnInit(): void {
    this.country = this.route.snapshot.paramMap.get('country')!;
    this.pageTitle = this.country;

    // Load Olympic data
    this.olympics$ = this.olympicService.getOlympics();
    this.medalsPerYear$ = this.olympicService.getMedalsPerYear(this.country);

    // Load additional data for the info bubbles
    this.subscriptions.push(
      this.olympicService
        .getNumberOfJOs()
        .subscribe((numberOfJOs) => (this.numberOfEntries = numberOfJOs))
    );
    this.subscriptions.push(
      this.olympicService
        .getTotalMedals(this.country)
        .subscribe((totalMedals) => (this.numberOfMedals = totalMedals))
    );
    this.subscriptions.push(
      this.olympicService
        .getTotalAthletes(this.country)
        .subscribe(
          (numberOfAthletes) => (this.numberOfAthletes = numberOfAthletes)
        )
    );

    // Listen to resize events
    this.subscriptions.push(
      fromEvent(window, 'resize').subscribe(() => this.updateWindowSize())
    );
  }

  // Unsubscribe from all subscriptions
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
