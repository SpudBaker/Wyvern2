import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, 
    signOut, user, User, UserCredential } from '@angular/fire/auth';
import { EMPTY, from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class AuthService{

    constructor(private auth: Auth, private router: Router){
        this.getLoginStatus().subscribe();
    }

    public createUserWithEmailAndPassword(email: string, password: string): Observable<UserCredential>{
        return from(createUserWithEmailAndPassword(this.auth, email, password));
    }

    public getLoginStatus(): Observable<User>{
        return user(this.auth).pipe(
            switchMap(data => {
                console.log(data);
                if(data){
                    console.log('logged in');
                    this.router.navigate(['home']);
                    return of(data); 
                } else {
                    console.log('not logged in');
                    this.router.navigate(['login']);
                    return EMPTY;
                }
            })
        )
    }

    public resetPassword(email: string): Observable<void>{
        return from (sendPasswordResetEmail(this.auth, email))
    }

    public signIn(email: string, password: string): Observable<UserCredential>{
        return from(signInWithEmailAndPassword(this.auth, email, password))  
    }

    public signOut(){
        signOut(this.auth).then(res => console.log(res));
    }

}