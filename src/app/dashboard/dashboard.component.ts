import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { OmdbService } from '../services/omdb.service';
import { Movie } from '../movie.interface';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeAnimation, listAnimation, listAnimationInOnly } from '../animations';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeAnimation, listAnimation, listAnimationInOnly]
})
export class DashboardComponent implements AfterViewInit {
  // @ts-ignore
  @ViewChild('searchbar') searchBar: ElementRef;
  movies: Movie[];
  nominations: Movie[];
  value: string;

  constructor(private omdb: OmdbService, private snackbar: MatSnackBar, private cookieService: CookieService) {
    this.movies = [];
    if (cookieService.check('nominations')) {
      this.nominations = JSON.parse(cookieService.get('nominations'));
    } else {
      this.nominations = [];
    }
    this.value = '';
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBar.nativeElement, 'keyup').pipe(
      filter(Boolean),
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
        this.handleSearch();
      }
    );
  }

  handleNomination(event: any, movie: Movie): void {
    if (this.nominations.length < 5 && !this.nominations.includes(movie)) {
      this.nominations.push(movie);
      this.cookieService.set('nominations', JSON.stringify(this.nominations), {expires: 1});
    }

    if (this.nominations.length >= 5) {
      this.snackbar.open('You\'ve reached 5 nominations!', 'Dismiss', {
        duration: 5000
      });
    }
  }

  handleRemove(event: any, movie: Movie): void {
    const i = this.nominations.indexOf(movie);
    if (i > -1) {
      this.nominations.splice(i, 1);
    }
  }

  handleSearch(event?: any): void {
    this.movies = [];
    this.omdb.searchByTitle(this.value).subscribe((res) => {
      this.movies = res;
    });
  }
}
