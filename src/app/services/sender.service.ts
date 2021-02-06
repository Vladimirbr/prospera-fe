import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IWeather } from '../interfaces/weather';
import { ICity } from '../interfaces/city';

@Injectable({
  providedIn: 'root',
})
export class SenderService {
  private baseUrl = 'http://localhost:3000/api/v1/';
  constructor(private http: HttpClient) {}

  fetchMovies(params: {
    page: number;
    title: string;
    year?: number;
    type?: string;
  }) {
    const url =
      `${this.baseUrl}movies/search?page=${params.page}&title=${params.title}` +
      (params.year ? `&year=${params.year}` : '') +
      (params.type ? `&type=${params.type}` : '');
    return this.http.get<{
      Search: [];
      totalResults: string;
      Response: string;
      Error?: string;
    }>(url);
  }

  fetchMovieDetails(params: { imdbID: string }) {
    const url = `${this.baseUrl}movies/details/${params.imdbID}`;

    return this.http.get<{ [key: string]: any }>(url);
  }

  fetchWeatherByLotLan(params: { lat: number; lon: number }) {
    const url = `${this.baseUrl}weather/info/?lat=${params.lat}&lon=${params.lon}`;

    return this.http.get<IWeather>(url);
  }

  fetchFiltredCities(params: { query: string }) {
    const url = `${this.baseUrl}weather/cities/?query=${params.query}`;
    return this.http.get<{ cities: ICity[] }>(url);
  }

  findByCityName(params: { name: string }) {
    const url = `${this.baseUrl}weather/city/?query=${params.name}`;
    return this.http.get<IWeather>(url);
  }
}
