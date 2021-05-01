import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Movie } from './movie.interface';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const key = '37a2c8a';
const url = 'http://www.omdbapi.com/';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {

  constructor(private http: HttpClient) {}

  searchByTitle(title: string, page: number = 1): Observable<Movie[]> {
    const movies = [];

    title = title.trim();

    const options = {
      params: new HttpParams()
        .set('s', title)
        .set('apikey', key)
        .set('type', 'movie')
    };

    return this.http.get<any>(url, options).pipe(
      map(res => {
        return res.Search.map((item: any) => {
          return {title: item.Title, year: item.Year, imdbID: item.imdbID} as Movie;
        }) as Movie[];
      }),
      catchError(error => {
        console.log(error);
        return [];
      })
    );
  }
}
