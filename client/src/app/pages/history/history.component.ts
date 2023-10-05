import { Component, OnInit } from '@angular/core';
import { Emitter } from 'src/app/emitters/emitter';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit{

    ngOnInit() {
        Emitter.authEmitter.emit(true)
    }
}    