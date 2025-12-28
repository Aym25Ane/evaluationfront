import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgClass,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true
})
export class Navbar {
  protected isMenuOpen = false;
  // Permet de savoir quel dropdown est ouvert : 'evaluation', 'formation' ou null
  protected activeDropdown: 'evaluation' | 'formation' | null = null;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.activeDropdown = null; // Ferme les dropdowns si on bascule le menu mobile
  }

  toggleDropdown(menu: 'evaluation' | 'formation') {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  // Ferme tout (utile quand on clique sur un lien)
  closeAll() {
    this.isMenuOpen = false;
    this.activeDropdown = null;
  }
}
