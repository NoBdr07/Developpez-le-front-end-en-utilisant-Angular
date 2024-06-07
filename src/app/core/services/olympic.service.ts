import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap, first } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { ToastrService } from 'ngx-toastr';
import { PieChartData } from '../models/PieChartData';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  public olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  loading$ = new BehaviorSubject<boolean>(false);

  loadInitialData(): Observable<Olympic[]> {
    this.loading$.next(true);
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
        this.loading$.next(false);
        if (!value) {
          this.toastr.warning('Database successfully loaded but empty.');
        }
      }),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next([]);
        this.loading$.next(false);
        this.toastr.error('An error occured while loading the data.');
        return caught;
      })
    );
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  // Get an array of pairs country:medals under the format of ngx-charts pieChart
  getMedalsPerCountry(): Observable<{ name: string; value: number }[]> {
    return this.olympics$.pipe(
      map((olympics) =>
        olympics.map((olympic) => ({
          name: olympic.country || '',
          value: olympic.participations
            ? olympic.participations.reduce(
                (total, participation) => total + participation.medalsCount,
                0
              )
            : 0,
        }))
      )
    );
  }

  // Get an array of countries
  getCountries(): Observable<string[]> {
    return this.olympics$.pipe(
      map((olympics) => {
        let countries: string[] = [];
        olympics.forEach((olympic) => {
          if (olympic.country) {
            countries.push(olympic.country);
          }
        });
        return countries;
      })
    );
  }

  // Get the number of JOs took into account in the db
  getNumberOfJOs(): Observable<number> {
    return this.olympics$.pipe(
      map((olympics) => {
        if (olympics.length > 0 && olympics[0].participations) {
          return olympics[0].participations.length;
        } else {
          return 0;
        }
      })
    );
  }

  // Get total number of medals for a country
  getTotalMedals(searchedCountry: string): Observable<number> {
    return this.olympics$.pipe(
      map((olympics) => {
        const countryOlympic = olympics.find(
          (olympic) => olympic.country === searchedCountry
        );

        return (
          countryOlympic?.participations?.reduce(
            (total, participation) => total + participation.medalsCount,
            0
          ) ?? 0
        );
      })
    );
  }

  // Get total number of athletes for a country
  getTotalAthletes(searchedCountry: string): Observable<number> {
    return this.olympics$.pipe(
      map((olympics) => {
        const countryOlympic = olympics.find(
          (olympic) => olympic.country === searchedCountry
        );

        if (!countryOlympic || !countryOlympic.participations) {
          return 0;
        }

        return countryOlympic.participations.reduce(
          (total, participation) => total + participation.athleteCount,
          0
        );
      })
    );
  }

  // For a specified country, get the number of medals per year in the format of ngx-charts lineChart
  getMedalsPerYear(searchedCountry: string): Observable<PieChartData[]> {
    return this.olympics$.pipe(
      map((olympics) => {
        const countryOlympic = olympics.find(
          (olympic) => olympic.country === searchedCountry
        );

        if (!countryOlympic || !countryOlympic.participations) {
          return [{ name: '', series: [] }];
        }

        return [
          {
            name: searchedCountry,
            series: countryOlympic.participations.map((participation) => ({
              name: participation.year.toString(),
              value: participation.medalsCount,
            })),
          },
        ];
      })
    );
  }

  // Check if the country is in the database
  isCountryInDatabase(country: string): Observable<boolean> {
    return this.olympics$.pipe(
      first(),
      map((olympics) => olympics.some((olympic) => olympic.country === country))
    );
  }
}
