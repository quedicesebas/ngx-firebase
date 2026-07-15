# @ngx-firebase

A lightweight, drop-in, and zoneless-friendly wrapper around the native **Firebase JS SDK** for **Angular 22+**.

This library serves as a modern, boilerplate-free alternative to `@angular/fire`, providing native Angular Dependency Injection (DI) class tokens and reactive RxJS wrappers around standard Firebase listeners.

---

## ⚡ Features

- 📦 **Zero overhead**: Communicates directly with the Firebase JS SDK without complex wrappers.
- 💉 **Native Angular DI**: Standard provider functions (`provideFirestore`, `provideAuth`, etc.) compatible with Angular's `ApplicationConfig`.
- 🎭 **RxJS Wrappers**: Lightweight, memory-leak-safe wrappers for common tasks (`docData`, `collectionSnapshots`, `user`).
- ⏱️ **Zoneless Friendly**: Uses native SDK snapshot listeners wrapped in RxJS observable streams.
- 📊 **Screen Tracking**: Custom built-in `ScreenTrackingService` for automated Google Analytics route tracking.

---

## 📦 Installation

Install both the library and the native Firebase SDK:

```bash
npm install ngx-firebase firebase
```

---

## 🚀 Quick Start

### 1. Configure Providers

Register the Firebase services in your `app.config.ts` using the functional providers:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { 
  provideFirebaseApp, 
  provideAuth, 
  provideFirestore 
} from 'ngx-firebase';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // Initialize Firebase App
    provideFirebaseApp(() => initializeApp({
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID"
    })),
    
    // Provide Firestore & Auth
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
};
```

### 2. Using Services in Standalone Components

Inject the native Firebase instances directly using the provided tokens, and use the RxJS helpers:

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, doc } from 'firebase/firestore';
import { docData } from 'ngx-firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-store-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="store$ | async as store">
      <h1>{{ store.name }}</h1>
      <p>{{ store.description }}</p>
    </div>
  `
})
export class StoreDetailComponent {
  private firestore = inject(Firestore);
  store$: Observable<any>;

  constructor() {
    // Reference a document using the native Firestore SDK
    const storeRef = doc(this.firestore, 'stores/store_123');
    
    // Wrap it reactively using docData
    this.store$ = docData(storeRef);
  }
}
```

### 3. Track Route Page Views Automatically (Google Analytics)

To enable automatic page view tracking, register `provideAnalytics` and inject `ScreenTrackingService` in your client config:

```typescript
import { ApplicationConfig, provideEnvironmentInitializer, inject } from '@angular/core';
import { getAnalytics } from 'firebase/analytics';
import { provideAnalytics, ScreenTrackingService } from 'ngx-firebase';

export const clientConfig: ApplicationConfig = {
  providers: [
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    provideEnvironmentInitializer(() => {
      // Force service initialization to listen to router events
      inject(ScreenTrackingService);
    })
  ]
};
```

---

## 📄 License

MIT © 2026 Sebas (quedicesebas)
