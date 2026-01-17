import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly _http = inject(HttpClient);
  // Using proxy path to avoid CORS issues locally
  private readonly _apiUrl = '/bp/products'; 

  constructor() { }

  getProducts(): Observable<Product[]> {
    return this._http.get<any>(this._apiUrl).pipe(
      map(response => {
        // Handle wrapped response { data: [...] } if present
        if (response && Array.isArray(response.data)) {
          return response.data;
        }
        // Fallback if it's already an array
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      }),
      catchError(this.handleError)
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this._http.post<Product>(this._apiUrl, product).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(product: Product): Observable<Product> {
    return this._http.put<Product>(`${this._apiUrl}/${product.id}`, product).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  verifyId(id: string): Observable<boolean> {
    return this._http.get<boolean>(`${this._apiUrl}/verification/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Async Validator
  idValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return this.verifyId(control.value).pipe(
        map(exists => (exists ? { idExists: true } : null)),
        catchError(() => of(null)) // Handle error gracefully in validator
      );
    };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
