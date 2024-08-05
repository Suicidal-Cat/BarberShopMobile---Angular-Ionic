import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Barber } from 'src/app/models/Barber/barber';
import { Status } from 'src/app/models/Barber/status';
import { Link } from 'src/app/models/Hateoas/Link';
import { BarberService } from 'src/app/services/Barber/barber.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-barber-details',
  templateUrl: './barber-details.page.html',
  styleUrls: ['./barber-details.page.scss'],
})
export class BarberDetailsPage implements OnInit {

  title:string="Create a barber";
  buttonText:string="Create barber";
  showSpinner:boolean=false;
  selectedStatus:number=0;
  inputFileText:string="No chosen file";
  workingHours:string[]=[];
  endHours:string="";
  startHours:string="";

  fileChoosen:boolean=false;
  fileBlob!:Blob;
  fileName!:string;

  barberId!:string | null;
  UpdateLink!:Link |undefined;
  FirstName!:string;
  LastName!:string;
  PhoneNumber!:string;
  ImageUrl!:string;

  update:boolean=false;


  statusOptions = [
    { value: Status.Active, label: 'Active' },
    { value: Status.Retired, label: 'Retired' },
    { value: Status.Left, label: 'Left' },
  ];

  constructor(private http:HttpClient,private navCtr:NavController,private barberService:BarberService
    ,private route:ActivatedRoute
  ) { }

  ngOnInit() {
    for(let i=8;i<=20;i++){
      const time1:string=i+":00";
      this.workingHours.push(time1);
      const time2:string=i+":30";
      this.workingHours.push(time2);
    }

    this.route.paramMap.subscribe(paramMap=>{
      this.barberId=paramMap.get("barberId");
      if(this.barberId=="0"){
        this.title="Create a barber";
        this.buttonText="Create";
        return;
      }
      else {
        this.title="Update a barber";
        this.update=true;
        this.buttonText="Update";
      }

      const link=this.barberService.getBarberLink();
      if(!paramMap.has("barberId") || link==undefined){
        this.navCtr.navigateBack("/home/tabs/service")
        return;
      }

      if(link!=undefined)this.barberService.getBarber(link).subscribe(
        (data)=>{
          this.FirstName=data.Value.FirstName;
          this.LastName=data.Value.LastName;
          this.PhoneNumber=data.Value.PhoneNumber;
          this.selectedStatus=data.Value.Status;
          this.startHours=data.Value.StartWorkingHours;
          this.endHours=data.Value.EndWorkingHours;
          this.ImageUrl=data.Value.ImageUrl
          this.barberService.setBarberLink(undefined);
          this.UpdateLink=data.Links.find((link)=>link.Rel=="update");
        }
      )

    });

  }

  navigateBack(){
    this.navCtr.navigateBack("home/tabs/barber");
  }

  saveBarberPic(form:NgForm){
    const formValue=form.value;
    this.showSpinner=true;
    if(this.barberId && parseInt(this.barberId)==0)this.createBarber(formValue);
    else if(this.barberId && parseInt(this.barberId)>0)this.updateBarber(formValue);

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
        this.fileBlob=blob;
        this.fileName=name;
      };

      reader.onerror = (error) => {
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
        return input;
    }
    const beforeLastDot = input.substring(0, lastDotIndex);
    const afterLastDot = input.substring(lastDotIndex);
    const replacedBeforeLastDot = beforeLastDot.replace(/\./g, replacement);
    return replacedBeforeLastDot + afterLastDot;
  }

  uploadFile(){
    return this.http.post(`${environment.appUrl}/Drive/upload/${this.fileName}`,this.fileBlob);
  }

  deleteFile(name:string){
    return this.http.delete(`${environment.appUrl}/Drive/delete/${name}`);
  }

  createBarber(formValue:any){
    this.uploadFile().subscribe({
      next: (value:any)=> {
        let barber:Barber={
          BarberId:0,
          FirstName:formValue.FirstName,
          LastName:formValue.LastName,
          Status:formValue.selectedStatus,
          PhoneNumber:formValue.PhoneNumber,
          StartWorkingHours:formValue.startHours,
          EndWorkingHours:formValue.endHours,
          ImageUrl:value.path,
        }
        this.barberService.addBarber(barber)?.subscribe({
          next:()=>{
            this.showSpinner=false;
            this.navCtr.navigateBack("/home/tabs/barber")
          },
          error:(err)=>{
            this.showSpinner=false;
          }
        })
      },
      error:(err)=> {
        this.showSpinner=false;
      },
    })
  }

  updateBarber(formValue:any){
    if(this.fileChoosen==true){
      this.deleteFile(this.ImageUrl).subscribe();
      this.uploadFile().subscribe({
        next: (value:any)=> {
          if(this.barberId && this.UpdateLink){

            let barber:Barber={
              BarberId:parseInt(this.barberId),
              FirstName:formValue.FirstName,
              LastName:formValue.LastName,
              Status:formValue.selectedStatus,
              PhoneNumber:formValue.PhoneNumber,
              StartWorkingHours:formValue.startHours,
              EndWorkingHours:formValue.endHours,
              ImageUrl:value.path,
            }
            this.barberService.updateBarber(barber,this.UpdateLink)?.subscribe({
              next:()=>{
                this.showSpinner=false;
                this.navCtr.navigateBack("/home/tabs/barber")
              },
              error:(err)=>{
                this.showSpinner=false;
              }
            })
          }
        },
        error:(err)=> {
          this.showSpinner=false;
        },
      })
    }
    else if(this.barberId && this.UpdateLink){

      let barber:Barber={
        BarberId:parseInt(this.barberId),
        FirstName:formValue.FirstName,
        LastName:formValue.LastName,
        Status:formValue.selectedStatus,
        PhoneNumber:formValue.PhoneNumber,
        StartWorkingHours:formValue.startHours,
        EndWorkingHours:formValue.endHours,
        ImageUrl:this.ImageUrl,
      }
      this.barberService.updateBarber(barber,this.UpdateLink)?.subscribe({
        next:()=>{
          this.showSpinner=false;
          this.navCtr.navigateBack("/home/tabs/barber")
        },
        error:(err)=>{
          this.showSpinner=false;
        }
      })
    }
  }

  compareTimes(time1: string, time2: string): boolean {
    // Parse the times
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
  
    // Compare hours first
    if (hours1 > hours2) {
      return true;
    } else if (hours1 < hours2) {
      return false;
    } else {
      // Hours are equal, compare minutes
      if (minutes1 > minutes2) {
        return true;
      } else{
        return false;
      }
    }
  }

  

}
