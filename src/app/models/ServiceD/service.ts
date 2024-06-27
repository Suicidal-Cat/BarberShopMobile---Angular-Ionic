import { ServiceCategory } from "../ServiceCategory/serviceCategory";

export interface Service{
    ServiceId:number,
    Name:string,
    Price:number,
    Duration:number,
    ServiceCategory: ServiceCategory,
}