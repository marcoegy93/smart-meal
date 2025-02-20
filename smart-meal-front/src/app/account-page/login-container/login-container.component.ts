import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/domain/service/notification.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RestaurantsService } from 'src/domain/service/RestaurantsService';

@Component({
  selector: 'app-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss']
})
export class LoginContainerComponent {

  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantsService,
    private notificationService: NotificationService,
    private router: Router,
    private authService: AuthService
  ) {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: [undefined, [Validators.required]],
      password: [undefined, [Validators.required]],
    });
  }

  async submit() {
    if (!this.loginForm.valid) {
      this.notificationService.send(NotificationService.getAnError("Des données sont manquantes", []));
      return;
    }

    const values = this.loginForm.value;

    try {
      const response = await this.restaurantService.login(values.email, values.password);
      this.authService.setAuthData(response);
      this.notificationService.send(NotificationService.getAnInfo("Connexion réussie !"));
      this.router.navigate(['/administration/dashboard']);
    } catch (error) {
      this.notificationService.send(NotificationService.getAnError("Erreur de connexion", []));
    }
  }
}
