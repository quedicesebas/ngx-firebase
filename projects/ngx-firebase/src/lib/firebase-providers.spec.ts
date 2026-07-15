import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi } from 'vitest';
import { docData, collectionSnapshots, user, provideFirebaseApp, FirebaseApp, Auth, provideAuth, firebaseSdk } from './firebase-providers';
import { DocumentReference, Query, QueryDocumentSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';

describe('Firebase Providers & Wrappers', () => {
  describe('RxJS Wrappers', () => {
    
    it('should wrap onSnapshot for docData and emit data', async () => {
      const mockData = { name: 'Test Store' };
      const mockSnapshot = {
        data: () => mockData,
        exists: () => true
      };

      // Mock onSnapshot using Vitest vi
      const onSnapshotSpy = vi.spyOn(firebaseSdk, 'onSnapshot').mockImplementation(((
        ref: any,
        next: any
      ) => {
        next(mockSnapshot);
        return () => {}; // Unsubscribe function
      }) as any);

      const mockRef = {} as DocumentReference;
      
      await new Promise<void>((resolve, reject) => {
        docData(mockRef).subscribe({
          next: (data) => {
            expect(data).toEqual(mockData);
            expect(onSnapshotSpy).toHaveBeenCalledWith(mockRef as any, expect.any(Function), expect.any(Function));
            resolve();
          },
          error: reject
        });
      });
    });

    it('should wrap onSnapshot for collectionSnapshots and emit snapshots', async () => {
      const mockDocs = [{ id: '1' }, { id: '2' }] as QueryDocumentSnapshot[];
      const mockQuerySnapshot = {
        docs: mockDocs
      };

      const onSnapshotSpy = vi.spyOn(firebaseSdk, 'onSnapshot').mockImplementation(((
        q: any,
        next: any
      ) => {
        next(mockQuerySnapshot);
        return () => {};
      }) as any);

      const mockQuery = {} as Query;
      
      await new Promise<void>((resolve, reject) => {
        collectionSnapshots(mockQuery).subscribe({
          next: (docs) => {
            expect(docs).toEqual(mockDocs);
            expect(onSnapshotSpy).toHaveBeenCalledWith(mockQuery as any, expect.any(Function), expect.any(Function));
            resolve();
          },
          error: reject
        });
      });
    });

    it('should wrap onAuthStateChanged for user and emit auth user', async () => {
      const mockUser = { uid: '12345', email: 'test@lacomanda.co' } as User;

      const onAuthStateChangedSpy = vi.spyOn(firebaseSdk, 'onAuthStateChanged').mockImplementation(((
        auth: any,
        next: any
      ) => {
        next(mockUser);
        return () => {};
      }) as any);

      const mockAuth = {} as Auth;
      
      await new Promise<void>((resolve, reject) => {
        user(mockAuth).subscribe({
          next: (u) => {
            expect(u).toEqual(mockUser);
            expect(onAuthStateChangedSpy).toHaveBeenCalledWith(mockAuth as any, expect.any(Function), expect.any(Function));
            resolve();
          },
          error: reject
        });
      });
    });
  });

  describe('DI Providers', () => {
    it('should resolve custom providers correctly', () => {
      const mockApp = { name: 'MockApp' } as any;
      const mockAuth = { app: mockApp } as any;

      TestBed.configureTestingModule({
        providers: [
          provideFirebaseApp(() => mockApp),
          provideAuth(() => mockAuth)
        ]
      });

      const app = TestBed.inject(FirebaseApp);
      const auth = TestBed.inject(Auth);

      expect(app).toBe(mockApp);
      expect(auth).toBe(mockAuth);
    });
  });
});
