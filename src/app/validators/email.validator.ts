import { FormControl } from "@angular/forms";

export const emailDomainValidator = (control: FormControl) => { 
    let email = control.value; 
    if (email && email.indexOf("@") != -1) { 
      let [_, domain] = email.split("@"); 
      if (domain !== "bluesoft-group.com"){ 
        return {
          emailDomain: {
            parsedDomain: domain
          }
        }
      }
    }
    return null; 
  }