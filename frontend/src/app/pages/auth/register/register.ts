import { ChangeDetectorRef, Component } from '@angular/core';
import { MaterialModule } from '../../../material/material/material-module';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { UserWordList, User, UserService } from '../../../services/user';
import { Word } from '../../../services/word';


@Component({
  selector: 'app-register',
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {
  errorMessage = '';
  newUser: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    lists: [] as UserWordList[],
    isAdmin: false,
    createdAt: new Date(),
  };

  registrationForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl("", [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(5),
      passwordStrengthValidator()
    ]),
    confirmPw: new FormControl('', [Validators.required])
  }, {
    validators: Register.passwordMatchValidator,
  }
  );

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) { }

  static passwordMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const originPw = group.get('password')?.value;
    const confirmPw = group.get('confirmPw')?.value;
    return originPw === confirmPw ? null : { passwordMismatch: true };
  }

  getFormErrors(): string {
    for (const field in this.registrationForm.controls) {
      const control = this.registrationForm.get(field);
      if (control && control.errors) {
        if (control.errors['required']) {
          return `Fill in the ${field} field.`;
        }
        if (control.errors['email']) {
          return 'The email format is invalid.';
        }
        if (control.errors['minlength']) {
          if (field === 'password') {
            return 'The password should be at least 6 characters.';
          } else if (field === 'firstName' || field === 'lastName') {
            return `${field} should be at least 2 characters.`;
          }
        }
        if (control.errors['weakPassword']) {
          return 'Password must include letters, numbers, and special characters.';
        }
      }
    }

    if (this.registrationForm.errors?.['passwordMismatch']) {
      return 'The password and confirm do not match.';
    }

    return '';
  }

  register() {
    this.errorMessage = this.getFormErrors();
    if (this.errorMessage) return;

    const formValues = this.registrationForm.value;

    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const firstName = capitalize(formValues.firstName ?? '');
    const lastName = capitalize(formValues.lastName ?? '');
    const email = formValues.email ?? '';
    const password = formValues.password ?? '';

    this.newUser = {
      ...this.newUser,
      firstName,
      lastName,
      email
    };

    this.userService.createUser(this.newUser).subscribe({
      next: (user) => {
        console.log('Registration successful / user:', user);
        alert(`Welcome: ${user.firstName}`);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = 'This email is already in use.';
        this.cd.detectChanges();
      },
    });
  }
}

// password validator
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-\+]/.test(value);

    if (!hasLetter || !hasNumber || !hasSpecial) {
      return { weakPassword: true };
    }
    return null;
  };
}
