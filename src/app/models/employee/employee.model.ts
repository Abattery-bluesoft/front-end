export class Employee {
    _id!: string;
    firstName:string | undefined;
    lastName:string | undefined;
    phone:number | undefined;
    city:string | undefined;
    zipCode:number | undefined;
    salary:number | undefined
    fonction: string | undefined;
    pole: string | undefined;
    field:string | undefined;
    comments:string | undefined;
    availabilityDate: Date | undefined;
    startDate: Date | undefined;
    cv!: string | '';
    status!: string | '';
}
