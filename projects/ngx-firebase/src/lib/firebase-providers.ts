import { inject, Injectable, Provider } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FirebaseApp as NativeFirebaseApp } from 'firebase/app';
import { Firestore, DocumentReference, Query, QueryDocumentSnapshot, onSnapshot } from 'firebase/firestore';
import { Auth as NativeAuth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseStorage as NativeFirebaseStorage } from 'firebase/storage';
import { Functions as NativeFunctions } from 'firebase/functions';
import { Analytics as NativeAnalytics, logEvent } from 'firebase/analytics';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// --- DI TOKENS ---
// We export abstract classes with matching names to act as DI Tokens in Angular
export abstract class FirebaseApp {}
export abstract class Auth {}
export abstract class FirebaseStorage {}
export abstract class Functions {}
export abstract class Analytics {}

// --- FIREBASE SDK MUTABLE WRAPPER FOR TESTING ---
export const firebaseSdk = {
  onSnapshot,
  onAuthStateChanged,
};

// --- RXJS WRAPPERS ---

/**
 * Wraps onSnapshot for a document reference.
 */
export function docData<T = any>(ref: DocumentReference<T>): Observable<T | undefined> {
  return new Observable<T | undefined>((subscriber) => {
    const unsubscribe = firebaseSdk.onSnapshot(
      ref,
      (snapshot) => {
        subscriber.next(snapshot.data());
      },
      (error) => {
        subscriber.error(error);
      }
    );
    return () => unsubscribe();
  });
}

/**
 * Wraps onSnapshot for a query/collection.
 */
export function collectionSnapshots<T = any>(q: Query<T>): Observable<QueryDocumentSnapshot<T>[]> {
  return new Observable<QueryDocumentSnapshot<T>[]>((subscriber) => {
    const unsubscribe = firebaseSdk.onSnapshot(
      q,
      (snapshot) => {
        subscriber.next(snapshot.docs);
      },
      (error) => {
        subscriber.error(error);
      }
    );
    return () => unsubscribe();
  });
}

/**
 * Wraps onAuthStateChanged to monitor auth state.
 */
export function user(auth: Auth): Observable<User | null> {
  return new Observable<User | null>((subscriber) => {
    const unsubscribe = firebaseSdk.onAuthStateChanged(
      auth as unknown as NativeAuth,
      (user) => {
        subscriber.next(user);
      },
      (error) => {
        subscriber.error(error);
      }
    );
    return () => unsubscribe();
  });
}

// --- SCREEN TRACKING SERVICE ---

/**
 * Custom ScreenTrackingService to replace @angular/fire/analytics ScreenTrackingService.
 * Automatically tracks page views on router navigation events.
 */
@Injectable({
  providedIn: 'root',
})
export class ScreenTrackingService {
  private analytics = inject(Analytics, { optional: true });
  private router = inject(Router, { optional: true });

  constructor() {
    if (this.analytics && this.router) {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          logEvent(this.analytics as unknown as NativeAnalytics, 'screen_view', {
            firebase_screen: event.urlAfterRedirects || event.url,
            firebase_screen_class: 'AngularRoute',
          });
        });
    }
  }
}

// --- DI PROVIDERS ---

export function provideFirebaseApp(fn: () => NativeFirebaseApp): Provider {
  return {
    provide: FirebaseApp,
    useFactory: fn,
  };
}

export function provideFirestore(fn: () => Firestore): Provider {
  return {
    provide: Firestore,
    useFactory: () => {
      inject(FirebaseApp); // Force app initialization before building Firestore
      return fn();
    },
  };
}

export function provideAuth(fn: () => NativeAuth): Provider {
  return {
    provide: Auth,
    useFactory: () => {
      inject(FirebaseApp); // Force app initialization before building Auth
      return fn();
    },
  };
}

export function provideStorage(fn: () => NativeFirebaseStorage): Provider {
  return {
    provide: FirebaseStorage,
    useFactory: () => {
      inject(FirebaseApp); // Force app initialization before building Storage
      return fn();
    },
  };
}

export function provideFunctions(fn: () => NativeFunctions): Provider {
  return {
    provide: Functions,
    useFactory: () => {
      inject(FirebaseApp); // Force app initialization before building Functions
      return fn();
    },
  };
}

export function provideAnalytics(fn: () => NativeAnalytics): Provider {
  return {
    provide: Analytics,
    useFactory: () => {
      inject(FirebaseApp); // Force app initialization before building Analytics
      return fn();
    },
  };
}
