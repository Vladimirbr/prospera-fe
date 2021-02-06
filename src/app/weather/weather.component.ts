import { Component, OnInit } from '@angular/core';
import { SenderService } from '../services/sender.service';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

import { IWeather } from '../interfaces/weather';
import { ICity } from '../interfaces/city';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  public showSpinner: boolean = false;
  public showError: boolean = false;
  public erroMessage: string = '';
  public showInfo: boolean = false;

  public searchCityCtrl = new FormControl();
  public filteredCities: ICity[] = [];
  public isLoading = false;
  public errorMsgAutoComplite: string = '';

  public weather!: IWeather;
  private subscription: Subscription = new Subscription();

  constructor(private sender: SenderService) {}

  ngOnInit(): void {
    this.subscription = this.searchCityCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsgAutoComplite = '';
          this.filteredCities = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.sender.fetchFiltredCities({ query: value }).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (data) => {
          if (!data) {
            this.errorMsgAutoComplite = 'No data returned';
            this.filteredCities = [];
            return;
          }
          this.errorMsgAutoComplite = '';
          this.filteredCities = data.cities;
        },
        (error) => {
          this.errorMsgAutoComplite = "Can't fetch cities";
          this.filteredCities = [];
          console.log(error);
        }
      );
  }

  findByMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.findByLocation(longitude, latitude);
      });
    } else {
      this.showInfo = false;
      alert('No support for geolocation');
    }
  }

  findByLocation(longitude: number, latitude: number) {
    this.showInfo = false;
    this.showSpinner = true;
    this.sender
      .fetchWeatherByLotLan({ lat: latitude, lon: longitude })
      .subscribe(
        (data) => {
          this.searchCityCtrl.setValue('', { emitEvent: false });
          this.showData(data);
        },
        (error) => {
          this.showErrorMessage('Error on fetch weather', error);
        }
      );
  }
  findByCity() {
    if (this.searchCityCtrl.value && this.searchCityCtrl.value.length) {
      this.showSpinner = true;
      this.showInfo = false;
      this.sender.findByCityName({ name: this.searchCityCtrl.value }).subscribe(
        (data) => {
          this.showData(data);
        },
        (error) => {
          this.showErrorMessage('Error on fetch cityweather', error);
        }
      );
    }
  }
  showErrorMessage(msg: string, error: any) {
    this.showSpinner = false;
    this.showError = true;
    this.erroMessage = msg;
    console.log(error);
  }
  showData(data: IWeather) {
    this.errorMsgAutoComplite = '';
    this.showSpinner = false;
    this.showError = false;
    this.erroMessage = '';
    this.weather = data;
    this.showInfo = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
