import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector   : 'app-lorem-ipsum-modal',
  templateUrl: './lorem-ipsum-modal.component.html',
  styleUrls  : ['./lorem-ipsum-modal.component.css']
})
export class LoremIpsumModalComponent implements OnInit {
  @Input()
  btn: string;
  @Input()
  title: string;

  constructor() {
  }

  ngOnInit() {
  }

}
