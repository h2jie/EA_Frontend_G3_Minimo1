import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { TagService } from '../services/tag.service';
import { UserService } from '../services/user.service';
import { Tag } from '../models/tag.model';

@Component({
  selector: 'app-user-tag',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxPaginationModule],
  templateUrl: './user-tag.component.html',
  styleUrls: ['./user-tag.component.css']
})
export class UserTagComponent implements OnInit {
  activeTab: string = 'manage-tags';
  
  message: string = '';
  messageType: string = '';
  
  tags: Tag[] = [];
  tagPage: number = 1;
  tagPageSize: number = 10;
  totalTags: number = 0;
  newTag: Tag = { name: '', description: '', category: '', isActive: true };
  editingTag: Tag | null = null;
  
  tagSearchQuery: string = '';
  tagSearchResults: Tag[] = [];
  tagSearchPage: number = 1;
  totalTagSearchResults: number = 0;
  
  users: any[] = [];
  userPage: number = 1;
  userPageSize: number = 10;
  totalUsers: number = 0;
  selectedUserId: string = '';
  selectedUser: any = null;
  userTags: any[] = [];
  
  // Search users by tag
  selectedTagForSearch: string = '';
  userSearchResults: any[] = [];
  userSearchPage: number = 1;
  userSearchPageSize: number = 10;
  totalUserSearchResults: number = 0;

  constructor(
    private tagService: TagService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadTags();
    this.loadUsers();
    
    
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId) {
      this.selectedUserId = currentUserId;
      this.selectUser(currentUserId);
    }
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  
  // Load all tabs (paging)
  loadTags(): void {
    this.tagService.getAllTags(this.tagPage, this.tagPageSize).subscribe({
      next: (response) => {
        this.tags = response.tags;
        this.totalTags = response.totalTags;
      },
      error: (err: any) => {
        this.showMessage('Error al cargar etiquetas: ' + err.message, 'error');
      }
    });
  }
  
  // Changing tabs
  changeTagPage(page: number): void {
    this.tagPage = page;
    this.loadTags();
  }
  
  // Creating a new label
  createTag(): void {
    if (!this.newTag.name.trim()) {
      this.showMessage('El nombre de la etiqueta es obligatorio', 'error');
      return;
    }
    
    this.tagService.createTag(this.newTag).subscribe({
      next: () => {
        this.showMessage('Etiqueta creada con éxito', 'success');
        this.loadTags();
        this.newTag = { name: '', description: '', category: '', isActive: true };
      },
      error: (err: any) => {
        this.showMessage('Error al crear etiqueta: ' + err.message, 'error');
      }
    });
  }
  
  // Setting the label to be edited
  editTag(tag: Tag): void {
    this.editingTag = { ...tag };
  }
  
  // Update Tags
  updateTag(): void {
    if (!this.editingTag) return;
    
    this.tagService.updateTag(this.editingTag._id!, this.editingTag).subscribe({
      next: () => {
        this.showMessage('Etiqueta actualizada con éxito', 'success');
        this.loadTags();
        this.editingTag = null;
      },
      error: (err: any) => {
        this.showMessage('Error al actualizar etiqueta: ' + err.message, 'error');
      }
    });
  }
  
  // Cancel Edit
  cancelEdit(): void {
    this.editingTag = null;
  }
  
  // Delete Tags
  deleteTag(tagId: string): void {
    if (confirm('¿Está seguro de eliminar esta etiqueta?')) {
      this.tagService.deleteTag(tagId).subscribe({
        next: () => {
          this.showMessage('Etiqueta eliminada con éxito', 'success');
          this.loadTags();
        },
        error: (err: any) => {
          this.showMessage('Error al eliminar etiqueta: ' + err.message, 'error');
        }
      });
    }
  }
  
  // search tags
  searchTags(): void {
    if (!this.tagSearchQuery.trim()) {
      this.tagSearchResults = [];
      return;
    }
    
    this.tagService.searchTags(this.tagSearchQuery, this.tagSearchPage, this.tagPageSize).subscribe({
      next: (response) => {
        this.tagSearchResults = response.tags;
        this.totalTagSearchResults = response.totalTags;
      },
      error: (err: any) => {
        console.error('Search tag detail error:', err);
        this.showMessage(`Error al buscar etiquetas: ${err.error?.message || err.message}`, 'error');
      }
    });
  }
  
  // Change tabbed search page
  changeTagSearchPage(page: number): void {
    this.tagSearchPage = page;
    this.searchTags();
  }

  // ========== User tag association function ==========
  
  // Load all users (paging)
  loadUsers(): void {
    this.userService.getUsers(this.userPage, this.userPageSize).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalUsers = response.totalUsers;
      },
      error: (err: any) => {
        this.showMessage('Error al cargar usuarios: ' + err.message, 'error');
      }
    });
  }
  
  // Changing the user page
  changeUserPage(page: number): void {
    this.userPage = page;
    this.loadUsers();
  }
  
  // Select users and load their tags
  selectUser(userId: string): void {
    this.selectedUserId = userId;
    
    if (!userId) {
      this.selectedUser = null;
      this.userTags = [];
      return;
    }
    
    // Loading user details
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.selectedUser = user;
        this.loadUserTags();
      },
      error: (err: any) => {
        this.showMessage('Error al cargar usuario: ' + err.message, 'error');
      }
    });
  }
  
  // Loading user tags
  loadUserTags(): void {
    if (!this.selectedUserId) return;
    
    this.tagService.getUserTags(this.selectedUserId).subscribe({
      next: (tags) => {
        this.userTags = tags;
      },
      error: (err: any) => {
        this.showMessage('Error al cargar etiquetas del usuario: ' + err.message, 'error');
      }
    });
  }
  
  // Add tags for users
  addTagToUser(tagId: string): void {
    if (!this.selectedUserId) {
      this.showMessage('Debe seleccionar un usuario', 'error');
      return;
    }
    
    this.tagService.addTagsToUser(this.selectedUserId, [tagId]).subscribe({
      next: () => {
        this.showMessage('Etiqueta añadida al usuario con éxito', 'success');
        this.loadUserTags();
      },
      error: (err: any) => {
        console.error('添加标签详细错误:', err);
        this.showMessage(`Error al añadir etiqueta: ${err.error?.message || err.message}`, 'error');
      }
    });
  }
  
  // Add a new tag to the user
  addNewTagToUser(tagName: string): void {
    if (!tagName.trim() || !this.selectedUserId) {
      this.showMessage('Debe ingresar un nombre de etiqueta y seleccionar un usuario', 'error');
      return;
    }
    
    this.tagService.addTagsToUserByName(this.selectedUserId, [tagName]).subscribe({
      next: () => {
        this.showMessage('Etiqueta añadida al usuario con éxito', 'success');
        this.loadUserTags();
      },
      error: (err: any) => {
        this.showMessage('Error al añadir etiqueta: ' + err.message, 'error');
      }
    });
  }
  
  // Remove tags from users
  removeTagFromUser(tagId: string): void {
    if (!this.selectedUserId) return;
    
    this.tagService.removeTagFromUser(this.selectedUserId, tagId).subscribe({
      next: () => {
        this.showMessage('Etiqueta eliminada del usuario con éxito', 'success');
        this.loadUserTags();
      },
      error: (err: any) => {
        this.showMessage('Error al eliminar etiqueta: ' + err.message, 'error');
      }
    });
  }
  
  // ========== Search User Functions by Tags ==========
  
  // Search users by tag
  searchUsersByTag(): void {
    if (!this.selectedTagForSearch) {
      this.userSearchResults = [];
      return;
    }
    
    this.tagService.findUsersByTag(this.selectedTagForSearch, this.userSearchPage, this.userSearchPageSize).subscribe({
      next: (response) => {
        this.userSearchResults = response.users;
        this.totalUserSearchResults = response.totalUsers;
      },
      error: (err: any) => {
        this.showMessage('Error al buscar usuarios: ' + err.message, 'error');
      }
    });
  }
  
  // Change user search page
  changeUserSearchPage(page: number): void {
    this.userSearchPage = page;
    this.searchUsersByTag();
  }

  showMessage(text: string, type: string): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
  
  userHasTag(tagId: string): boolean {
    return this.userTags.some((tag: any) => tag._id === tagId);
  }
}