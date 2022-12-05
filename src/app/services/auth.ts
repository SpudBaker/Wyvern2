import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, 
    signOut, user, User } from '@angular/fire/auth';
import { collection, doc, docData, Firestore, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';

import { EMPTY, from, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as Globals from'../../globals';

@Injectable({providedIn: 'root'})

export class AuthService{

    private loggedIn: boolean;
    private user: Globals.User;

    constructor(private auth: Auth, private firestore: Firestore, private router: Router){
        this.getLoginStatus().subscribe();
    }

    public createUserWithEmailAndPassword(email: string, password: string): Promise<any>{
        return createUserWithEmailAndPassword(this.auth, email, password).then(async user => {
            const q = query(collection(this.firestore, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            if(querySnapshot.empty){
                const usersCollection = collection(this.firestore, "users");
                setDoc(doc(usersCollection, user.user.uid), {email, score: 100});
            } else {
            }
        })
    }

    public getAuth(): Auth {
        return this.auth;
    }

    public getLoginStatus(): Observable<User>{
        return user(this.auth).pipe(
            switchMap(data => {
                if(data){
                    this.user = new Globals.User();
                    this.user.email = data.email;
                    this.user.id = data.uid;
                    if(!this.loggedIn){
                        this.router.navigate(['home']);
                        this.loggedIn = true;
                    }
                    return of(data); 
                } else {
                    this.user = undefined;
                    this.loggedIn = false;
                    this.router.navigate(['login']);
                    return EMPTY;
                }
            })
        );
    }

    public getUserDatabaseRecordByID(id: string): Observable<Globals.User>{
        return docData(doc(this.firestore, 'users/' + id)).pipe(
          first(), 
          map(doc => {
            const user = new Globals.User();
            user.email = doc.email;
            user.id= id;
            user.score = doc.score;
            return user;
          })
        )
    }

    public getUserEmail(): string {
        return this.user.email;
    }

    public getUserId(): string {
        return this.user.id;
    }

    public resetPassword(email: string): Observable<void>{
        return from (sendPasswordResetEmail(this.auth, email))
    }

    public async signIn(email: string, password: string): Promise<any>{
        return signInWithEmailAndPassword(this.auth, email, password)
    }

    public signOut(){
        signOut(this.auth);
    }
 
    public updateUserScore(user: Globals.User, scoreChange: number): Promise<any>{
        return updateDoc(doc(this.firestore, 'users/' + user.id), {score: user.score + scoreChange})
    }

}