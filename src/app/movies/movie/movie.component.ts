import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SenderService } from 'src/app/services/sender.service';
import { DialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
})
export class MovieComponent implements OnInit {
  @Input() movie: any;
  @Input() index: any;
  constructor(public dialog: MatDialog, private sender: SenderService) {}

  public show: boolean = false;
  public message: string = '';
  public showSpinner: boolean = false;

  ngOnInit(): void {}

  openDialog(data: { [key: string]: any }) {
    const dialogRef = this.dialog.open(DialogComponent, { data });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getMovieDetails() {
    this.showSpinner = true;
    this.sender.fetchMovieDetails({ imdbID: this.movie.imdbID }).subscribe(
      (data) => {
        this.showSpinner = false;
        this.openDialog(data);
      },
      (error) => {
        this.showSpinner = false;
        console.log(error);
        this.show = true;
        this.message = "can't find movie details, try again";
      }
    );
  }
}
