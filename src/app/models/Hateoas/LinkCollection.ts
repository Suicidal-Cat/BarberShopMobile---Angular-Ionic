import { Link } from "./Link";

export interface LinkCollection<T>{
    links:Link[],
    value:T,
}