import { Status } from "./status";

export interface Barber{
    BarberId:number,
    FirstName:string,
    LastName:string,
    PhoneNumber:string,
    Status:Status,
    ImageUrl:string,
    StartWorkingHours:string,
    EndWorkingHours:string,
}