import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { OmdbService } from '../omdb.service';
import { Movie } from '../movie.interface';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  // @ts-ignore
  @ViewChild('searchbar') searchBar: ElementRef;
  movies: Movie[];
  nominations: Movie[];
  value: string;

  constructor(private omdb: OmdbService, private snackbar: MatSnackBar) {
    this.movies = [];
    this.nominations = [];
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
    this.omdb.searchByTitle(this.value).subscribe((res) => {
      this.movies = res;
    });
  }
}
