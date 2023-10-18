import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private http: HttpClient
  ) {
    this.http.get<any>(`https://refezione-be.vercel.app/api/refezione?id=1`).subscribe(data => {
      console.log("------- ~ Tab1Page ~ data:", data);



    })
  }

}
