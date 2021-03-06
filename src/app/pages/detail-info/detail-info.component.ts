import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/modals/customer.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-info',
  templateUrl: './detail-info.component.html',
  styleUrls: ['./detail-info.component.css']
})
export class DetailInfoComponent implements OnInit {

  private authListenerSubs: Subscription;
  private customerListenerSubs: Subscription;

  userIsAuthenticated = false;
  customerId: string;
  username: string;
  infoCustomer: Customer;
  characterAvt: string;

  isChange = false;
  isDisabled = true;
  formInfo: FormGroup;
  showChangePass = false;


  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private authService: AuthService,
    public customerService: CustomerService,
    private router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.formInfo = new FormGroup({
      username: new FormControl(null, {
      }),
      fullName: new FormControl(null, {
      }),
      phoneNumber: new FormControl(null, {
      }),
      email: new FormControl(null, {
      }),
      address: new FormControl(null, {
      }),
    });

    this.authService.autoAuthCustomer();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.customerId = this.authService.getCustomerId();
    this.username = this.authService.getUsername();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    });

    this.customerService.getInfoCustomer().then(
      (infoData) => {
        // tslint:disable-next-line:prefer-const
        let info = infoData as Customer;
        this.infoCustomer = {
          username: info.username,
          email: info.email,
          phoneNumber: info.phoneNumber,
          fullName: info.fullName,
          address: info.address
        };
        this.characterAvt = info.username[0].toUpperCase();

        this.formInfo.setValue({
          username: this.infoCustomer.username || '',
          fullName: this.infoCustomer.fullName || '',
          phoneNumber: this.infoCustomer.phoneNumber || 0,
          email: this.infoCustomer.email || '',
          address: this.infoCustomer.address || ''
        });
        this.formInfo.disable();
      });

  }

  isEnableForm() {
    this.isChange = true;
    this.formInfo.enable();
  }

  isDisableForm() {
    Swal.fire({
      title: 'H???y thay ?????i?',
      icon: 'question'
    }).then(() => {
      this.formInfo.setValue({
        username: this.infoCustomer.username,
        fullName: this.infoCustomer.fullName,
        phoneNumber: this.infoCustomer.phoneNumber,
        email: this.infoCustomer.email,
        address: this.infoCustomer.address
      });
      this.isChange = false;
      this.formInfo.disable();
    });
    
  }

  updateInfo()  {
    console.log(this.formInfo.value);
    this.customerService.updateInfo(
      this.formInfo.value.email,
      this.formInfo.value.phoneNumber.toString(),
      this.formInfo.value.fullName,
      this.formInfo.value.address,
      this.formInfo.value.username
    ).then(() => {
      Swal.fire({
        title: 'Thay ?????i th??ng tin th??nh c??ng!',
        icon: 'success'
      }).then(() => {
        this._document.defaultView.location.reload();
      });
    });
  }

  chagePassword(form: NgForm) {

    if (form.invalid) { return; }
    if(form.value.passwordChange !== form.value.rePasswordChange) {
      Swal.fire({
        title: 'M???t kh???u kh??ng tr??ng kh???p!',
        icon: 'error'
      });
    } else {
      this.authService.changePassword(form.value.passwordChange).then(
        (result) => {
          if(result) {
            Swal.fire({
              title: 'B???n ???? thay ?????i m???t kh???u th??nh c??ng! Vui l??ng ????ng nh???p l???i!',
              icon: 'success'
            }).then(() => {
              this.router.navigate(['/login']);
            });
          } else {
            Swal.fire({
              title: 'Thay ?????i m???t kh???u th???t b???i! Vui l??ng ki???m tra l???i!',
              icon: 'error'
            }).then(() => {
              // this.router.navigate(['/login']);
            });
          }
        });
    }
    
  }

  cancelChangePass() {
    this.showChangePass = false;
  }

  deleteAccount() {
    Swal.fire({
      title: 'B???n c?? mu???n x??a t??i kho???n kh??ng?',
      icon: 'question',
      showCancelButton: true
    }).then((result) => {
      if(result.isConfirmed) {
        console.log('customerId: ', this.customerId);
        this.authService.deleteAccount(this.customerId).then(() => {
          Swal.fire({
            title: 'B???n ???? x??a th??nh c??ng!',
            icon: 'success'
          }).then(() => {
            this.router.navigate(['home']);
          })
        });
      } else {

      }
    })
  }
}
