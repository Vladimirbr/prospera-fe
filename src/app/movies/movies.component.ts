import { Component, OnInit } from '@angular/core';
import { SenderService } from '../services/sender.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
})
export class MoviesComponent implements OnInit {
  public movies: [] = [];
  public name: string = '';
  private oldName: string = '';
  public type: string = '';
  private oldType: string = '';
  public year: string = '';
  public oldYear: string = '';

  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 1000;
  public dataSource: any;
  public displayResult: boolean = false;

  public show: boolean = false;
  public message: string = '';
  public showSpinner: boolean = false;

  constructor(private sender: SenderService) {}

  ngOnInit(): void {}

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.findMovie();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.movies.slice(start, end);
    this.dataSource = part;
  }

  public findMovie() {
    if (!this.name) return;

    if (
      this.oldName !== this.name ||
      this.oldType !== this.type ||
      this.oldYear !== this.year
    ) {
      this.oldName = this.name;
      this.currentPage;
    }
    const params: any = {
      page: this.currentPage + 1,
      title: this.name,
    };
    if (this.type) {
      params['type'] = this.type;
    }
    if (this.year) {
      params['year'] = +this.year;
    }
    this.showSpinner = true;
    this.sender.fetchMovies(params).subscribe(
      (data) => {
        this.showSpinner = false;
        if (data.Response === 'False') {
          console.log(data.Error);
          this.showSpinner = false;
          this.displayResult = false;
          this.show = true;
          this.message = "can't find movies, try again";
          return;
        }
        this.show = false;
        this.message = '';

        this.movies = data.Search;
        this.totalSize = +data.totalResults;
        this.iterator();
        this.displayResult = true;
      },
      (error) => {
        this.showSpinner = false;
        this.displayResult = false;
        this.show = true;
        this.message = 'error on featch movies';
        console.log(error);
      }
    );
  }
}
