import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OneDriveService {

  constructor(private http:HttpClient) { }

  getImageUrl(fileName:string){
    return this.http.get<any>(`${environment.appUrl}/Drive/downloadLink/${fileName}`);
  }
}
