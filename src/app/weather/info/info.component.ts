import { Component, OnInit, Input } from '@angular/core';
import { IWeather } from '../../interfaces/weather';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit {
  @Input() weather!: IWeather;
  constructor() {}

  ngOnInit(): void {}
}
