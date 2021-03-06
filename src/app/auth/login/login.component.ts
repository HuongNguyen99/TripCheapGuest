import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth_customer.service';
import { Router, RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private authStatusSub: Subscription;
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    public authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {

  }

  onLogin(form: NgForm) {
    if (form.invalid) { return; }
    this.authService.login(form.value.email, form.value.password);
    // this._document.defaultView.location.reload();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    // this.authStatusSub.unsubscribe();
  }

}
