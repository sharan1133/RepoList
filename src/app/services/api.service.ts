/*import { HttpClient , HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, throwError } from 'rxjs';

import { Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getUser(githubUsername: string) {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}`);
  }

  

  getRepos(githubUsername: string): Observable<any[]> {
    const url = `https://api.github.com/users/${githubUsername}/repos`;
    return this.httpClient.get<any[]>(url).pipe(
      catchError((error: any) => {
        console.error('Error fetching repositories:', error);
        return throwError(error);
      })
    );
  }

  getReposWithPagination(githubUsername: string, page: number, itemsPerPage: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', itemsPerPage.toString());

    return this.httpClient.get(`https://api.github.com/users/${githubUsername}/repos`, { params });
  }
  
}*/


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams , HttpHeaders , HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { forkJoin } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  getUser(githubUsername: string): Observable<any> {
    const url = `${this.baseUrl}/users/${githubUsername}`;
    return this.http.get(url);
  }

  getRepos(githubUsername: string): Observable<any[]> {
    const url = `${this.baseUrl}/users/${githubUsername}/repos`;
    return this.http.get<any[]>(url);
  }

  getReposWithPagination(githubUsername: string, page: number, perPage: number): Observable<any[]> {
    const url = `${this.baseUrl}/users/${githubUsername}/repos`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    
    return this.http.get<any[]>(url, { params });
  }

  getReposWithNextPage(nextPageUrl: string): Observable<any[]> {
    return this.http.get<any[]>(nextPageUrl);
  }

  /*extractLinkHeader(headers: HttpHeaders): HttpHeaders {
    const linkHeader = headers.get('Link');
    return new HttpHeaders({ 'Link': linkHeader ? linkHeader : '' });
  }*/

  /*extractLinkHeader(headers: HttpHeaders): string | null {
    const linkHeader = headers.get('Link');
    return linkHeader ? linkHeader : null;
  }*/

  extractLinkHeader(response: any): string | null {
    // Check if 'headers' is available in the response
    if (response.headers) {
      const linkHeader = response.headers.get('Link');
      return linkHeader || null;
    }
    return null;
  }


  getRepositoryDescription(username: string, repoName: string): Observable<any> {
    const url = `${this.baseUrl}/repos/${username}/${repoName}`;
    return this.http.get(url).pipe(
      catchError((error: any) => {
        console.error(`Error fetching description for ${repoName}: ${error.message}`);
        return of({ description: 'No description' });
      })
    );
  }
  

  
  
}

