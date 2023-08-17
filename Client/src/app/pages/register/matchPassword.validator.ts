import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


  export const matchPassword : ValidatorFn = (control: AbstractControl):ValidationErrors|null =>{

     let password = control.get('password');
     let confirmpassword = control.get('ConfirmPassword');
     if(password && confirmpassword && password?.value != confirmpassword?.value){
        return {
            passwordMatcherror : true }
     }
    return null; 
   }