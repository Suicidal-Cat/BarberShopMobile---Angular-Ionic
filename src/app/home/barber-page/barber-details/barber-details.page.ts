import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-barber-details',
  templateUrl: './barber-details.page.html',
  styleUrls: ['./barber-details.page.scss'],
})
export class BarberDetailsPage implements OnInit {

  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

  loadImageFromDevice(event: any) {
    return;
    const file = event.target.files[0];
    if(file){
      const reader = new FileReader();
      const name=this.replaceAllDotsExceptLast(file.name,"")

      reader.readAsArrayBuffer(file);

      reader.onload = () => {

        // get the blob of the image:
        let blob: Blob = new Blob([new Uint8Array((reader.result as ArrayBuffer))]);

        // create blobURL, such that we could use it in an image element:
        console.log(blob)
        this.http.post(`${environment.appUrl}/Drive/upload/${name}`,blob).subscribe({
          next(value:any) {
            console.log(value.path)
          },
          error(err) {
            console.log(err)
          },
        });

      };

      reader.onerror = (error) => {

        //handle errors
        console.log(error)

      };
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
