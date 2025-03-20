
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

  getAccessToken(oauth_token: string, oauth_verifier: string, email: string): Observable<any> {
    const url = `${this.apiBaseUrl}/access_token?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}&email=${email}`;
    return this.http.get(url);
  }

  

  getAuthorizationStatus(email: string): Observable<{ 
    twitterToken?: string;
    twitterSecret?: string;
    instagramToken?: string;
    facebookToken?: string;
}> {
    return this.http.get(`${this.baseURL}/_design/View/_view/user_by_email?key="${email}"`, { headers: this.headers }).pipe(
      map((res: any) => {
        if (res.rows.length > 0) {
          const user = res.rows[0].value;
          return {
            twitterToken: user.data.oauth_token || undefined,  // Twitter OAuth token
            twitterSecret: user.data.oauth_token_secret || undefined,  // Twitter Secret Token
            instagramToken: user.data.instagram_token || undefined,  // Instagram token (if available)
            facebookToken: user.data.facebook_token || undefined,  // Facebook token (if available)
          };
        } else {
          throw new Error("User Not Found");
        }
      }),
      catchError((error) => {
        console.error('Error fetching authorization status:', error);
        return throwError(error);
      })
    );
}

  
  

  updateUserTokens(email: string, oauth_token: string, oauth_token_secret: string) {
    return this.http.get(`${this.baseURL}/_design/View/_view/user_by_email?key="${email}"`, { headers: this.headers }).subscribe(
      (res: any) => {
        console.log('CouchDB Response:', res);

        if (res.rows.length > 0) {
          const user = res.rows[0].value; // Get User
          const userId = user._id;
          const userRev = user._rev;

          console.log(' Matched User:', user);

          // Store Tokens Inside Data Object 
          user.data.oauth_token = oauth_token;
          user.data.oauth_token_secret = oauth_token_secret;

          const body = {
            _id: userId,
            _rev: userRev,
            data: user.data,   // Updated Data
          };

          console.log('Final Body:', body);

          this.http.put(`${this.baseURL}/${userId}?rev=${userRev}`, body, { headers: this.headers }).subscribe(
            (updateRes) => {
              console.log('Token Updated:', updateRes);
              alert('Twitter Token Stored Inside Data Successfully!');
            },
            (err) => {
              console.error(' Update Error:', err);
              alert('Failed to Store Twitter Token');
            }
          );
        } else {
          console.error(' User Not Found');
          alert('User Not Found!');
        }
      },
      (err) => {
        console.error(' Fetch User Error:', err);
      }
    );
  }
  removeUserTokens(email: string): Observable<any> {
    return this.http.get(`${this.baseURL}/_design/View/_view/user_by_email?key="${email}"`, { headers: this.headers }).pipe(
      mergeMap((res: any) => {
        if (res.rows.length > 0) {
          const user = res.rows[0].value;
          const userId = user._id;
          const userRev = user._rev;

          user.data.oauth_token = '';
          user.data.oauth_token_secret = '';

          const body = {
            _id: userId,
            _rev: userRev,
            data: user.data,
          };

          return this.http.put(`${this.baseURL}/${userId}?rev=${userRev}`, body, { headers: this.headers });
        } else {
          throw new Error("User Not Found");
        }
      })
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

            if (oauth_token && oauth_token_secret) {
     
              const uniqueId = Math.floor(Math.random() * 10000);
              const updatedText = `${text} #${uniqueId}`;

              return this.http.post(`${this.apiBaseUrl}/post`, {
                text: updatedText, 
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
  //Register
  addUser(data: any): Observable<any> {
    return this.http.post<any>(this.baseURL, data, { headers: this.headers });
  }

  getUserDetails(email: string): Observable<any> {
    return this.http.get(`${this.baseURL}/_design/View/_view/user_by_email?key="${email}"`, { headers: this.headers });
  }

  //login

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseURL}/_design/View/_view/user_by_email?key="${email}"`, { headers: this.headers });
  }

  // updateUser(_id: string, data: any): Observable<any> {
  //   return this.http.put(`${this.baseURL}/${_id}`, data);
  // }

  createProperty(propertyData: any): Observable<any> {
    return this.http.post(this.baseURL, propertyData, { headers: this.headers }).pipe(
      catchError((error) => throwError(() => new Error(error)))
    );
  }
  getAllProperties() {
    return this.http.get<any>(`${this.baseURL}/_design/View/_view/property_by_id`, { headers: this.headers });
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

 // Save Property for a User
 saveProperty(userId: string, propertyId: string): Observable<any> {
  const saveData = {
    data: {
      user_id: userId,
      property_id: propertyId,
    }
  };

  return this.http.post(`${this.baseURL}/saved_properties`, saveData, {
    headers: this.headers,
  }).pipe(
    catchError((error) => throwError(() => new Error(error)))
  );
}

// Fetch Saved Properties for a User
getSavedProperties(userId: string): Observable<any> {
  return this.http.get(`${this.baseURL}/_design/View/_view/saved_by_id?key="${userId}"`, {
    headers: this.headers,
  }).pipe(
    map((response: any) => response.rows.map((row: any) => row.value)),
    catchError(error => throwError(() => new Error(error)))
  );
}
}

