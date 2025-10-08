import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { query } from '@firebase/firestore';
import { Observable, observable } from 'rxjs';
import { addDoc, collection, collectionData, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Data} from '../app/tracker/usersData';
import { spendings } from './Models/spendingsList';


@Injectable({
  providedIn: 'root'
})
export class DataManagerService {
  
  LoggedIn: boolean;
  uid: string;
  constructor(private fire: Firestore, private fs: AngularFirestore, private fa: AngularFireAuth, private router: Router) {
    this.LoggedIn = false;
    this.fa.onAuthStateChanged((user) => {
      if (user) {
        this.LoggedIn = true;
        this.uid = user.uid;
      }
      else {
        this.LoggedIn = false;
        
      }
    });
  }

  signup(user: any): Promise<any> {
    return this.fa.createUserWithEmailAndPassword(user.email, user.password)
      .then((resultl) => {
        this.setAccount(user.displayName)

      })
      .catch(error => {
        var error = error.message
      })
  }

  login(email: string, password: string): Promise<any> {
 
    return this.fa.signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('success');

      })
      .catch(error => {
        console.log('Auth Service: login error...');
        console.log('error code', error.code);
        console.log('error', error);
        if (error.code)
            return { isValid: false };
    });

  }

  logoutUser(): Promise<void> {
    return this.fa.signOut()
        .then(() => {
            this.router.navigate(['/login']);
        })
        .catch(error => {
            console.log('Auth Service: logout error...');
            console.log('error code', error.code);
            console.log('error', error);
            if (error.code)
                return error;
        });
}


  setAccount(username: any) {
    this.fs.collection('users').doc(this.uid).set({
      username: username,
      MainBalance: 0,
      SavingsBalance: 0,
      SpendingsBalance: 0,

    })
    
  }

  updateBalance(balance: number, sBalance: number, spBalance:number) {
    this.fs.collection('users').doc(this.uid).update({
      MainBalance: balance ,
      SavingsBalance: sBalance,
      SpendingsBalance: spBalance,

    })
  }

  addSpendings(spend:spendings){
    let $productsRef=collection(this.fire,"users/"+this.uid+"/spendings");
    return addDoc($productsRef,spend)
  }
  getSpendings()
  {
    let $productsRef=collection(this.fire,"users/"+this.uid+"/spendings");
    return collectionData($productsRef,{idField:"id"}) as Observable<spendings[]>;
  }
  getSp(){
    return this.fs.collection('users').doc(this.uid).collection('spendings').valueChanges()
  }

  getData() {
    return this.fs.collection('users').doc(this.uid).valueChanges()
  }

  getDataV2(){
    let $productsRef=collection(this.fire,"users/"+this.uid);
    return collectionData($productsRef,{idField:"id"}) as Observable<Data[]>
  }

  addData(name:string,dateOf:string,price:number) {
    this.fs.collection('users').doc(this.uid).collection('spendings').add({
      name: name,
      date:dateOf,
      cost: price
    })
  }

}


