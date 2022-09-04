import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, 
    signOut, user, User, UserCredential } from '@angular/fire/auth';
import { EMPTY, from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class AuthService{

    private userEmail: string;

    constructor(private auth: Auth, private router: Router){
        this.getLoginStatus().subscribe();
    }

    public createUserWithEmailAndPassword(email: string, password: string): Observable<UserCredential>{
        return from(createUserWithEmailAndPassword(this.auth, email, password));
    }

    public getAuth(): Auth {
        return this.auth;
    }

    public getLoginStatus(): Observable<User>{
        return user(this.auth).pipe(
            switchMap(data => {
                if(data){
                    this.userEmail = data.email;
                    this.router.navigate(['home']);
                    return of(data); 
                } else {
                    this.userEmail = null;
                    this.router.navigate(['login']);
                    return EMPTY;
                }
            })
        );
    }

    public getUserEmail(): string {
        return this.userEmail;
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