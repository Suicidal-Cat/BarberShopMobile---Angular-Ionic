import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Status } from 'src/app/models/Barber/status';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-barber-details',
  templateUrl: './barber-details.page.html',
  styleUrls: ['./barber-details.page.scss'],
})
export class BarberDetailsPage implements OnInit {

  title:string="Create a barber";
  showSpinner:boolean=false;
  selectedStatus:number=0;
  inputFileText:string="No chosen file";
  workingHours:string[]=[];
  endHours:string="";
  startHours:string="";

  fileChoosen:boolean=false;

  statusOptions = [
    { value: Status.Active, label: 'Active' },
    { value: Status.Retired, label: 'Retired' },
    { value: Status.Left, label: 'Left' },
  ];

  constructor(private http:HttpClient,private navCtr:NavController) { }

  ngOnInit() {
    for(let i=8;i<=20;i++){
      const time1:string=i+":00";
      this.workingHours.push(time1);
      const time2:string=i+":30";
      this.workingHours.push(time2);
    }
  }

  navigateBack(){
    this.navCtr.navigateBack("home/tabs/barber");
  }

  saveBarberPic(form:NgForm){

  }


  loadImageFromDevice(event: any) {
    const file = event.target.files[0];
    if(file){
      const reader = new FileReader();
      const name=this.replaceAllDotsExceptLast(file.name,"")

      reader.readAsArrayBuffer(file);

      this.inputFileText="1 file chosen"
      this.fileChoosen=true;

      reader.onload = () => {

        // get the blob of the image:
        let blob: Blob = new Blob([new Uint8Array((reader.result as ArrayBuffer))]);

        // this.http.post(`${environment.appUrl}/Drive/upload/${name}`,blob).subscribe({
        //   next(value:any) {
        //     console.log(value.path)
        //   },
        //   error(err) {
        //     console.log(err)
        //   },
        // });

      };

      reader.onerror = (error) => {

        //handle errors
        console.log(error)

      };
    }
    else {
      this.fileChoosen=false;
      this.inputFileText="No chosen file";
    }

    
  }

  replaceAllDotsExceptLast(input: string, replacement: string): string {
    const lastDotIndex = input.lastIndexOf('.');

    if (lastDotIndex === -1) {
        // No dot found, return the original string
        return input;
    }

    // Replace all dots except the last one
    const beforeLastDot = input.substring(0, lastDotIndex);
    const afterLastDot = input.substring(lastDotIndex);
    
    // Replace dots in the part before the last dot
    const replacedBeforeLastDot = beforeLastDot.replace(/\./g, replacement);
    
    // Concatenate the replaced part with the untouched last dot
    return replacedBeforeLastDot + afterLastDot;
}

  

}
