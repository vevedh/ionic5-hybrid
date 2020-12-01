import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import feathers from '@feathersjs/feathers';
import feathersSocketIOClient from '@feathersjs/socketio-client';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class VvService {


  apiUrl= new BehaviorSubject<string>('http://vps-79ccca4d.vps.ovh.ca:3050');
  feathers: any;
  socket: any;
  feathersAuthClient: any;
  currentUser= new BehaviorSubject<any>({});
  authenticated = new BehaviorSubject<boolean>(false);
  isOnline = new BehaviorSubject<boolean>(false);

  constructor() { 
    this.feathers = feathers();

    /*
    this.apiUrl.subscribe((value)=>{
     if (window.location.origin == "http://localhost:8100") {
      this.apiUrl.next('http://vps-79ccca4d.vps.ovh.ca:3050');
     } else {
       this.apiUrl.next(window.location.origin);//'http://chartes.cacem.fr'
     }
    })
    */

    if (Capacitor.platform == 'electron') {
      this.apiUrl.next('http://vps-79ccca4d.vps.ovh.ca:3050');
    }

    this.socket = require('socket.io-client')(this.apiUrl.value, { transports: ['websocket'] , reconnection: true});
    console.log('Chemin du serveur defini dans la conf :',this.apiUrl.value);

    this.feathersAuthClient = require('@feathersjs/authentication-client').default;


    /*  this.feathers.configure(
        feathersRx({
          // add feathers-reactive plugin
          idField: "_id",
        })
      );
    */

    this.feathers.configure(
        feathersSocketIOClient(this.socket, { timeout: 10000 })
    );//feathersSocketIOClient



    this.feathers.configure(this.feathersAuthClient({                   // add authentication plugin
        storage: window.localStorage
    }));


    
    this.feathers.io.on('connect', async () => {
      console.log("Socket connected ");
      console.log('Chemin actuel du socket client :',this.feathers.io.io.uri);
      console.log("Feathersjs client :",this.feathers);
      //console.log("Feathersjs client id :",this.feathers.io.id);
      //console.log("Feathersjs clients ids :",this.feathers.io.ids);
      this.authenticated.next(this.feathers.authentication.authenticated);
      this.currentUser.next(await this.feathers.get('authentication'))
      this.isOnline.next(true);
      console.log("Est autentifier :",this.authenticated.value)
      console.log("Est en ligne :",this.isOnline.value)
      console.log("Utilisateur :",this.currentUser.value)


    });

    this.feathers.io.on('connect_error', async (err) => {
      console.log("new Socket connect error ",err);
      this.isOnline.next(false);
    });


    //console.log("Feather Client service :", this.feathers);

  }
}
