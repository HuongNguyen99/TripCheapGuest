import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';

import { Order } from '../modals/order.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ServiceSelect } from '../modals/serviceSelect.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private orders: Order[] = [];
  private ordersUpdated = new Subject<Order[]>();
  BACKEND_URL = environment.apiURL + '/order/';

  constructor(
    private http: HttpClient,
    private router: Router) {}

  getOrders() {
    this.http
    .get<{ message: string; order: any }>(this.BACKEND_URL)
    .pipe(
      map(orderData => {
        console.log(orderData);
        return orderData.order.map(order => {
          return {
            id: order._id,
            nameTicket: order.nameTicket,
            imageTicket: order.imageTicket,
            dateStart: order.dateStart,
            dateEnd: order.dateEnd,
            idTicket: order.idTicket,
            idCreator: order.idCreator,
            idCustomer: order.idCustomer,
            itemService: order.itemService
          };
        });
      })
    ).subscribe(transformedOrder => {
      console.log(transformedOrder);
      this.orders = transformedOrder;
      this.ordersUpdated.next([...this.orders]);
    });
  }

  getOrderUpdateListener() {
    return this.ordersUpdated.asObservable();
  }

  getOneOrder(id: string) {
    return this.http.get<{
      _id: string;
      nameTicket: string;
      imageTicket: string;
      dateStart: string;
      dateEnd: string;
      idTicket: string;
      idCreator: string;
      idCustomer: string;
      itemService: Array<ServiceSelect>;
    }>(this.BACKEND_URL + 'update/'  + id);
  }

  getCountOrder() {
    return this.http.get<{
      countOrder: number;
    }>(this.BACKEND_URL + 'count');
  }

  getOrderOfCustomer() {
    this.http.get<
      { message: string; order: any }>
      (this.BACKEND_URL + 'order').pipe(
        map(orderData => {
          return orderData.order.map(order => {
            return {
              id: order._id,
              nameTicket: order.nameTicket,
              imageTicket: order.imageTicket,
              dateStart: order.dateStart,
              dateEnd: order.dateEnd,
              idTicket: order.idTicket,
              idCreator: order.idCreator,
              idCustomer: order.idCustomer,
              itemService: order.itemService
            };
          });
        })
      ).subscribe(transformedOrder => {
        this.orders = transformedOrder;
        this.ordersUpdated.next([...this.orders]);
      });
  }

  addOrder(
    nameTicket: string,
    imageTicket: string,
    dateStart: string,
    dateEnd: string,
    idTicket: string,
    idCreator: string,
    idCustomer: string,
    itemService: Array<ServiceSelect>,
    payMethod: string,
  ) {
    // tslint:disable-next-line:prefer-const
    let orderData: Order | FormData;
    orderData = {
        id: null,
        nameTicket: nameTicket,
        imageTicket: imageTicket,
        dateStart: dateStart,
        dateEnd: dateEnd,
        idTicket: idTicket,
        idCreator: idCreator,
        idCustomer: idCustomer,
        itemService: itemService,
        payMethod: payMethod
    };
    this.http
      .post<
        { message: string; order: Order }>
        (this.BACKEND_URL, orderData)
      .subscribe(responseData => {
        console.log(responseData);
      });
        console.log(orderData);
    return orderData;
  }

  updateOrder(
    id: string,
    nameTicket: string,
    imageTicket: string,
    dateStart: string,
    dateEnd: string,
    idTicket: string,
    idCreator: string,
    idCustomer: string,
    itemService: Array<ServiceSelect>,
    payMethod: string
  ) {
    let orderData: Order | FormData;
    orderData = {
        id: id,
        nameTicket: nameTicket,
        imageTicket: imageTicket,
        dateStart: dateStart,
        dateEnd: dateEnd,
        idTicket: idTicket,
        idCreator: idCreator,
        idCustomer: idCustomer,
        itemService: itemService,
        payMethod: payMethod
    };

    this.http
      .put<{ message: string; order: Order }>
        (this.BACKEND_URL + id, orderData)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  deleteOrder(orderId: Array<string>) {
    console.log(orderId);
    this.http
      .delete(this.BACKEND_URL + 'list/' + orderId.join()).subscribe(response => {
        console.log(response);
        this.getOrders();
      });
  }

  // getOrderToPay(orderId: Array<string>) {
  //   console.log(orderId);
  //   this.http.get<{ message: string; order: any }>(this.BACKEND_URL + 'pay/' +  orderId.join())
  //   .pipe(
  //     map(orderData => {
  //       console.log(orderData);
  //       return orderData.order.map(order => {
  //         return {
  //           id: order._id,
  //           nameTicket: order.nameTicket,
  //           imageTicket: order.imageTicket,
  //           dateStart: order.dateStart,
  //           dateEnd: order.dateEnd,
  //           idTicket: order.idTicket,
  //           idCreator: order.idCreator,
  //           idCustomer: order.idCustomer,
  //           itemService: order.itemService
  //         };
  //       });
  //     })
  //   ).subscribe(transformedOrder => {
  //     console.log(transformedOrder);
  //     this.orders = transformedOrder;
  //     this.ordersUpdated.next([...this.orders]);
  //   });
  // }

}
