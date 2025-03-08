
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

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

  // OAuth Credentials
  private oauthToken: string = '';
  private oauthTokenSecret: string = '';
  private apiBaseUrl = 'http://localhost:8000/twitter-api';; // Replace with actual API

  constructor(private http: HttpClient) { }

  getRequestToken(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/request_token`);
  }

  authorizeToken(oauth_token: string): Observable<any> {
    window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${oauth_token}`;
    return this.http.get(`${this.apiBaseUrl}/authorize_token?oauth_token=${oauth_token}`);
  }
  getAccessToken(oauth_token: string, oauth_verifier: string, email: string): Observable<any> {
    const url = `${this.apiBaseUrl}/access_token?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}&email=${email}`;
    return this.http.get(url);
  }
  updateUserTokens(email: string, oauth_token: string, oauth_token_secret: string) {
    return this.http.get(`${this.baseURL}/_design/View/_view/user_by_email?key="${email}"`, { headers: this.headers }).subscribe(
      (res: any) => {
        console.log('✅ CouchDB Response:', res);

        if (res.rows.length > 0) {
          const user = res.rows[0].value; // Get User
          const userId = user._id;
          const userRev = user._rev;

          console.log('🎯 Matched User:', user);

          // Store Tokens Inside Data Object 🔥🔥
          user.data.oauth_token = oauth_token;
          user.data.oauth_token_secret = oauth_token_secret;

          const body = {
            _id: userId,
            _rev: userRev,
            data: user.data,   // Updated Data
          };

          console.log('🚀 Final Body:', body);

          this.http.put(`${this.baseURL}/${userId}?rev=${userRev}`, body, { headers: this.headers }).subscribe(
            (updateRes) => {
              console.log('✅ Token Updated:', updateRes);
              alert('🎯 Twitter Token Stored Inside Data Successfully!');
            },
            (err) => {
              console.error('❌ Update Error:', err);
              alert('Failed to Store Twitter Token');
            }
          );
        } else {
          console.error('🚫 User Not Found');
          alert('User Not Found!');
        }
      },
      (err) => {
        console.error('❌ Fetch User Error:', err);
      }
    );
  }

  postTweet(text: string, email: string): Observable<any> {
    return this.http
      .get(`${this.baseURL}/_design/View/_view/user_by_email?key="${email}"`, { headers: this.headers })
      .pipe(
        map((userDoc: any) => {
          if (userDoc.rows.length > 0) {
            const user = userDoc.rows[0].value;
            const oauth_token = user.data.oauth_token;
            const oauth_token_secret = user.data.oauth_token_secret;
             console.log("hello")
            if (oauth_token && oauth_token_secret) {
              return this.http.post(`${this.apiBaseUrl}/post`, {
                text,
                email,
                oauth_token,
                oauth_token_secret,
              }, { headers: this.headers });
            } else {
              throw new Error("Twitter Tokens Not Found");
            }
          } else {
            throw new Error("User Not Found");
          }
        }),
        mergeMap((httpObservable) => httpObservable) // Merge the inner observable to handle API response
      );
  }
  
  


  // Existing Methods (Retained)
  addUser(data: any): Observable<any> {
    return this.http.post<any>(this.baseURL, data, { headers: this.headers });
  }

  getUserDetails(email: string): Observable<any> {
    return this.http.get(`${this.baseURL}/_design/View/_view/user_by_email?key="${email}"`, { headers: this.headers });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseURL}/_design/View/_view/user_by_email?key="${email}"`, { headers: this.headers });
  }

  updateUser(_id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseURL}/${_id}`, data);
  }

  createProperty(propertyData: any): Observable<any> {
    return this.http.post(this.baseURL, propertyData, { headers: this.headers }).pipe(
      catchError((error) => throwError(() => new Error(error)))
    );
  }

  getPropertyById(propertyId: string): Observable<any> {
    return this.http.get(`${this.baseURL}/_design/View/_view/property_by_id?key="${propertyId}"`, { headers: this.headers }).pipe(
      map((response: any) => response.rows.length > 0 ? response.rows[0].value : null),
      catchError(error => throwError(() => new Error(error)))
    );
  }

  getUserProperties(userId: string): Observable<any> {
    return this.http.get(`${this.baseURL}/_design/View/_view/property_by_id`, { headers: this.headers }).pipe(
      map((response: any) => response.rows.map((row: any) => row.value)),
      catchError((error) => throwError(() => new Error(error)))
    );
  }

  onStorepropertyImage(userId: string, propertyId: string, propertyData: FormData) {
    const URL = `http://localhost:8000/property-image/${userId}/${propertyId}`;
    return this.http.post<any>(URL, propertyData);
  }

  updateProperty(propertyId: string, updatedData: any, rev: string): Observable<any> {
    updatedData._rev = rev;
    return this.http.put(`${this.baseURL}/${propertyId}`, updatedData, { headers: this.headers }).pipe(
      catchError((error) => throwError(() => new Error(error)))
    );
  }

  deleteProperty(propertyId: string): Observable<any> {
    return this.getPropertyById(propertyId).pipe(
      map((property) => property._rev),
      switchMap((rev) => {
        return this.http.delete(`${this.baseURL}/${propertyId}?rev=${rev}`, { headers: this.headers });
      }),
      catchError((error) => throwError(() => new Error(error)))
    );
  }

  getSavedProperties(userId: string): Observable<any> {
    const url = `${this.baseURL}/_design/View/_view/property_by_id?key="${userId}"`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((response: any) =>
        response.rows
          .map((row: any) => row.value)
          .filter((property: any) => property.saved === true)
      ),
      catchError((error) => throwError(() => new Error(error)))
    );
  }

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
