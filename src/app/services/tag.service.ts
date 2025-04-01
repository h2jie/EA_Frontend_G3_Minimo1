import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = 'http://localhost:9000/api'; 

  constructor(private http: HttpClient) { }

  // Get all tags
  getAllTags(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tags?page=${page}&pageSize=${pageSize}`);
  }

  // Get all users
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }

  // Creating a new label
  createTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(`${this.apiUrl}/tags`, tag);
  }

  // Update Tags
  updateTag(tagId: string, tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/tags/${tagId}`, tag);
  }

  // Delete Tags 
  deleteTag(tagId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tags/${tagId}`);
  }

  // Get the user's label
  getUserTags(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/users/${userId}/tags`);
  }

  // Add tags for users
  addTagsToUser(userId: string, tagIds: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/tags`, { tagIds });
  }

  // Adding tags (by name)
  addTagsToUserByName(userId: string, tagNames: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/tags/byname`, { tagNames });
  }

  // Remove tags from users
  removeTagFromUser(userId: string, tagId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}/tags/${tagId}`);
  }

  // Find Users by Tag
  findUsersByTag(tagId: string, page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tags/${tagId}/users?page=${page}&pageSize=${pageSize}`);
  }

  // Find users by tag name
  findUsersByTagName(tagName: string, page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tags/name/${tagName}/users?page=${page}&pageSize=${pageSize}`);
  }

  // search tags
  searchTags(query: string, page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tags/search?q=${query}&page=${page}&pageSize=${pageSize}`);
  }
}