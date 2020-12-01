import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pwrshell-card',
  templateUrl: './pwrshell-card.component.html',
  styleUrls: ['./pwrshell-card.component.scss'],
})
export class PwrshellCardComponent implements OnInit {

  obj = {
    cmd:'',
    desc:'',
    title:'',
    
  };
  
  constructor() { }

  ngOnInit() {}

  onRunCmd(event) {

  }

}
