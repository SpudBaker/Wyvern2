import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, 
    signOut, user, User, UserCredential } from '@angular/fire/auth';
import { addDoc, collection, collectionData, doc, docSnapshots, DocumentData, DocumentReference, Firestore, getDoc, getDocs, getFirestore, query, runTransaction, Transaction, where } from '@angular/fire/firestore';

import { EMPTY, from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class AuthService{

    private userEmail: string;

    constructor(private auth: Auth, private firestore: Firestore, private router: Router){
        this.getLoginStatus().subscribe();
    }

    public createUserWithEmailAndPassword(email: string, password: string): Promise<any>{
        return createUserWithEmailAndPassword(this.auth, email, password).then(async () => {
            const q = query(collection(this.firestore, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            if(querySnapshot.empty){
                const usersCollection = collection(this.firestore, "users");
                addDoc(usersCollection, {email});
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
                    this.userEmail = data.email;
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

    public async signIn(email: string, password: string): Promise<any>{
        return signInWithEmailAndPassword(this.auth, email, password)
    }

    public signOut(){
        signOut(this.auth);
    }

}