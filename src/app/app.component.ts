import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: any = {};
  inputUsername: string = ''; 
  githubForm: FormGroup;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  repositoryData: any[] = [];
  loadingData: boolean = false;
  errorLoadingData: string | null = null;
  nextPageUrl: string | null = null;

  ngOnInit()
  {
    this.fetchUserData(this.inputUsername);
    console.log(this.fetchUserData);
  }



  
  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.githubForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  fetchUserData(username: string) {
    this.apiService.getUser(username).subscribe((userData: any) => {
      this.user = userData;
    });
  }


  onUsernameInput() {
    const username = this.inputUsername.trim();
    if (username) {
      this.loadData(username , 1);
    }
  }

  

  /*loadData(username: string, page: number) {
    this.apiService
      .getReposWithPagination(username, page, this.itemsPerPage)
      .subscribe((repos: any) => {
        this.repositoryData = repos;
      });
  }*/

  loadData(username: string, page: number) {
    this.apiService
      .getReposWithPagination(username, page, this.itemsPerPage)
      .subscribe((repos: any) => {
        const observables: Observable<any>[] = repos.map((repo: any) => {
          return this.apiService.getRepositoryDescription(username, repo.name);
        });
  
        forkJoin(observables).subscribe((descriptions: any[]) => {
          for (let i = 0; i < repos.length; i++) {
            repos[i].description = descriptions[i].description;
          }
          this.repositoryData = repos;
        });
      });
  }
  


  
  
  
  


  onSubmit() {
    const username = this.githubForm.get('username')?.value;
    this.currentPage = 1; 
    this.loadData(username, this.currentPage);
    this.fetchUserData(username);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadData(this.inputUsername , this.currentPage);
    }
  }

  
  nextPage() {
    if (this.currentPage >= 1) {
      this.currentPage++;
      const username = this.inputUsername;
      console.log(username);
      const nextPageUrl = `https://api.github.com/users/${username}/repos?page=${this.currentPage}&per_page=${this.itemsPerPage}`;
      this.loadingData = true;
  
      this.apiService.getReposWithNextPage(nextPageUrl).subscribe(
        (repos: any) => {
          
          this.repositoryData = [];
  
          
          this.repositoryData = repos;
  
          this.loadingData = false;
        },
        (error) => {
          this.errorLoadingData = 'Failed to load data.';
          this.loadingData = false;
        }
      );
    }
  }
  
}