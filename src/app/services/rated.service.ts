import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Rated } from '../modals/rated.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class RatedService {
    private rated: Rated;
    BACKEND_URL = environment.apiURL + '/rated/';

    constructor(
        private http: HttpClient,
        private router: Router) {}
    
    getRated(ticketId) {
        return this.http.get<{
                message: string,
                rated: Rated
            }>(this.BACKEND_URL + ticketId);
    }

    createRated(
        idTicket: string,
        idCreator: string,
        countRated: number,
        pointRated: number,
        listUserRated: Array<any>
    ) {
        const rateData = {
            idTicket : idTicket,
            idCreator : idCreator,
            countRated : countRated,
            pointRated : pointRated,
            listUserRated : listUserRated
        }
        return new Promise((resolve) => {
            this.http.post<
                { message: string; rated: Rated }>
                (this.BACKEND_URL, rateData)
                .subscribe(responseData => {
                resolve(responseData.rated);
                console.log('responseDt: ', responseData.rated);
            });
        });
    }

    addRatedByUser(
        idTicket: string,
        idUser: string,
        nameUser: string,
        rating : number,
        feedback: string,
        create_at: string) {
        
        var listUserRated = {
            idUser  : idUser,
            nameUser  : nameUser,
            rating  : rating,
            feedback: feedback,
            create_at: create_at
        }
        var data = {
            idTicket  : idTicket,
            rating: rating,
            listUserRated: listUserRated
        }
        return new Promise((resolve) => {
            this.http.put<
                {message: string; status: boolean}>
                (this.BACKEND_URL + idTicket, data).subscribe(res => {
                    resolve(res.status);
                });
        });
    }

}