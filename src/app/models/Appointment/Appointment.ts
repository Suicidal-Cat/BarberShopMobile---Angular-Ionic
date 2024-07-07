import { User } from "../Account/user";
import { Barber } from "../Barber/barber";
import { Service } from "../ServiceD/service";

export interface Appointment{
    AppointmentId?:number,
    Date:string,
    StartTime:string,
    AppDuration:number,
    Price:number,
    IsCanceled:boolean,
    Barber:Barber,
    IdentityUser?:User,
    Services:Service[]
}