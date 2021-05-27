import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Comment } from 'src/app/modals/comment.model';
import { Customer } from 'src/app/modals/customer.model';
import { Ticket } from 'src/app/modals/ticket.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CommentService } from 'src/app/services/comment.service';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';
import { AngularFireStorage, AngularFireStorageReference } from "@angular/fire/storage";
import { finalize } from 'rxjs/operators';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {

  @Input() ticket: Ticket;

  comments: Comment[] = [];
  private commentSub: Subscription;
  userIsAuthenticated = false;

  ticketId: string;
  customerId: string;
  infoCustomer: Customer;
  characterAvt: string;
  isLikeComment = [];
  countLikeComments = [];
  enterMessage = "";
  fileImage : Array<File> = [];
  previewImage: Array<String> = [];
  storageRef: AngularFireStorageReference;
  imageObject: Array<Object> = [];
  
  constructor(
    public commentService: CommentService,
    public route: ActivatedRoute,
    public customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private storage: AngularFireStorage,
  ) {}
  
  
  ngOnInit(): void {
    this.authService.autoAuthCustomer();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.customerId = this.authService.getCustomerId();
    // get user
    if(this.userIsAuthenticated) {
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
        }
      );
    }
    // get comment
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.ticketId = paramMap.get('ticketId');
      this.commentService.getCommentsOfTicket(this.ticketId);
      this.commentSub = this.commentService.getCommentUpdateListener()
        .subscribe((comments: Comment[]) =>  {
        this.comments = comments;
        comments.forEach( el =>{
          this.isLikeComment.push(el.isMyLike);
          this.countLikeComments.push(el.likeCount);
          var img = [];
          for (let i = 0; i < el.images.length; i++) {
            img[i] = {
              image : el.images[i],
              thumbImage: el.images[i]
            };
          }
          this.imageObject.push(img);
          console.log('imageObj: ', this.imageObject);
        })
        console.log('comment get: ',comments);
      });
    });

  }

  formatDate(date) {
    var d = new Date(date);
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var minutescovert = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutescovert + ' ' + ampm;

    return d.getDay() + '/' + d.getMonth() + '/' + d.getFullYear()
      + ' (' + strTime + ')';
  }


  navigateToLogin() {
    localStorage.setItem('ticketId',this.ticketId);
    localStorage.setItem('type', 'detailTicket');
  }

  onSaveComment(mes) {
    var dateNow = new Date();
    if(mes.trim() == '') {
      Swal.fire({
        title:'Bạn chưa nhận xét! Hãy để lại nhận xét của bạn!',
        icon: 'info'
      });
    } else {
      let listUploadImage = [];
      for(const item of this.fileImage) {
        listUploadImage.push(this.onUploadImageToFirebase(item));
      }
      Promise.all(listUploadImage).then(values => {
        console.log('list file upload: ', values);
        var comment : Comment = {
          id: '',
          idUser: this.customerId,
          idTicket: this.ticketId,
          idCreator: this.ticket.creator,
          username: this.infoCustomer.username,
          message: mes,
          images: values,
          rating: 0,
          likeCount: 0,
          isMyLike: false,
          created_at: dateNow.toString()
        }
        console.log('comment: ', comment);
        this.commentService.addComment(
          this.customerId,
          this.ticketId,
          this.ticket.creator,
          mes,
          this.infoCustomer.username,
          values,
          0,
          0,
          false
        ).then((value) => {
          Swal.fire({
            title: 'Đã gửi bình luận của bạn!',
            icon: 'success'
          }).then(() => {
            this.comments.push(comment);
            this.countLikeComments.push(0);
            this.isLikeComment.push(false);
            this.previewImage = [];
          });
        })
      });
    }
  }

  likeComment(count, i) {
    let Ilike = false;
    if(this.isLikeComment[i]) {
      this.countLikeComments[i] = count - 1;
      Ilike = false;
    } else {
      this.countLikeComments[i] = count + 1;
      Ilike = true;
    }
    this.isLikeComment[i] = !this.isLikeComment[i];
    this.commentService.updateIsLike(
      this.comments[i].id,
      this.countLikeComments[i],
      Ilike
    ).then((value : any) => {
      console.log(value);
    })

  }

  onDeleteComment(idComment, index) {
    console.log('delete: ', idComment);
    Swal.fire({
      title:'Xóa bình luận của bạn?',
      icon:'question',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Xóa',
      cancelButtonColor: '#ff4171'

    }).then((result) => {
      if(result.isConfirmed) {
        this.commentService.deleteComment(idComment).then((res : any) => {
          if(res.status) {
            Swal.fire({
              title: 'Đã xóa bình luận của bạn!',
              icon: 'success'
            }).then(() => {
              this.comments.splice(index, 1);
              this.countLikeComments.splice(index, 1);
              this.isLikeComment.splice(index, 1);
            });
          } else {
            Swal.fire({
              title: res.message,
              icon: 'error'
            });
          }
        });
      }
    });
  }

  onUploadImageToFirebase(img) {
    var n = Date.now();
    console.log(img);
    const filePath = `image_customer_comment/${n}`;
    const fileRef = this.storage.ref(filePath);

    return new Promise<any>((resolve, reject) => {
      const task = this.storage.upload(`image_customer_comment/${n}`, img);

        task.snapshotChanges().pipe(
            finalize(() => fileRef.getDownloadURL().subscribe(
                res => resolve(res),
                err => reject(err))
            )
        ).subscribe();
    })
  };

  onFileChange(event) {

    if(event.target.files &&  event.target.files[0]) {
      for (var i = 0; i < event.target.files.length; i++) {
        this.fileImage.push(event.target.files[i]);
        var reader = new FileReader();
        reader.onload = (event:any) => {
          this.previewImage.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
      
    }
  }

  showImage(url) {
    Swal.fire({
      imageUrl: url,
      imageWidth: 1200,
      imageHeight: 900,
      showConfirmButton:false
    })
  }

  ngOnDestroy(): void {
    this.commentSub.unsubscribe();
  }

}