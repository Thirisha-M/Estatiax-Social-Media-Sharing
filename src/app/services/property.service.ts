import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private baseURL = 'https://192.168.57.185:5984/estatiax';
  private userName = 'd_couchdb';
  private password = 'Welcome#2';

  private headers = new HttpHeaders({
    Authorization: 'Basic ' + btoa(`${this.userName}:${this.password}`),
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) { }

    // Register user in CouchDB
    addUser(data: any): Observable<any> {
      return this.http.post<any>(this.baseURL, data, { headers: this.headers });
    }
    getUserDetails(email: string): Observable<any> {
      return this.http.get(`${this.baseURL}/_design/View/_view/user_by_email?key="${email}"`, { headers: this.headers });
    }
    // Fetch user by email
    getUserByEmail(email: string): Observable<any> {
      return this.http.get(`${this.baseURL}/_design/View/_view/user_by_email?key="${email}"`, { headers: this.headers });
    }

  // Create a new property
  createProperty(propertyData: any): Observable<any> {
    return this.http.post(this.baseURL, propertyData, { headers: this.headers }).pipe
      (catchError((error) => throwError(() => new Error(error))));
  }

  getPropertyById(propertyId: string): Observable<any> {
    return this.http.get(`${this.baseURL}/_design/View/_view/property_by_id?key="${propertyId}"`, { headers: this.headers }).pipe(
      map((response: any) => response.rows.length > 0 ? response.rows[0].value : null),  // Return first object instead of an array
      catchError(error => throwError(() => new Error(error)))
    );
  }

  getUserProperties(userId: string): Observable<any> {
    return this.http.get(`${this.baseURL}/_design/View/_view/property_by_id`, { headers: this.headers }).pipe(
      map((response: any) => response.rows.map((row: any) => row.value)), // Extracts property data from rows
      catchError((error) => throwError(() => new Error(error)))
    );
  }

  onStorepropertyImage(userId: string, propertyId: string, propertyData: FormData) {
    const URL = `http://localhost:8000/property-image/${userId}/${propertyId}`;
    return this.http.post<any>(URL, propertyData)
  }

  // Update an existing property
  updateProperty(propertyId: string, updatedData: any, rev: string): Observable<any> {
    updatedData._rev = rev;
    return this.http.put(`${this.baseURL}/${propertyId}`, updatedData, { headers: this.headers }).pipe(
      catchError((error) => throwError(() => new Error(error)))
    );
  }

  // Delete a property
  deleteProperty(propertyId: string): Observable<any> {
    return this.getPropertyById(propertyId).pipe(
      map((property) => property._rev),
      switchMap((rev) => {
        return this.http.delete(`${this.baseURL}/${propertyId}?rev=${rev}`, { headers: this.headers });
      }),
      catchError((error) => throwError(() => new Error(error)))
    );
  }
  
  // Fetch saved properties for a user using CouchDB view
  getSavedProperties(userId: string): Observable<any> {
    const url = `${this.baseURL}/_design/View/_view/property_by_id?key="${userId}"`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((response: any) =>
        response.rows
          .map((row: any) => row.value)
          .filter((property: any) => property.saved === true) // Filter only saved properties
      ),
      catchError((error) => throwError(() => new Error(error)))
    );
  }

  // Save or unsave a property
  saveProperty(propertyId: string, save: boolean): Observable<any> {
    return this.getPropertyById(propertyId).pipe(
      map((property) => {
        property.saved = save;
        return this.http.put(`${this.baseURL}/${propertyId}`, property, { headers: this.headers });
      }),
      catchError((error) => throwError(() => new Error(error)))
    );
  }
}
