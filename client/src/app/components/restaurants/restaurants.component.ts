import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule],
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css'],
})
export class RestaurantsComponent implements OnInit {
  restaurants: any[] = [];
  filteredRestaurants: any[] = [];
  selectedSort: string = '';
  selectedCategory: string = '';

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        const menuRequests = data.map((restaurant) =>
          this.restaurantService.getMenusByRestaurantId(restaurant._id).toPromise().then(menus => ({
            ...restaurant,
            menus
          }))
        );
  
        Promise.all(menuRequests).then(restaurantsWithMenus => {
          this.restaurants = restaurantsWithMenus.filter(r => r.menus && r.menus.length > 0);
          this.filteredRestaurants = [...this.restaurants];
        });
      },
      error: (err) => console.error('Error loading restaurants:', err),
    });
  }

  applyFilters(): void {
    let filtered = [...this.restaurants];

    if (this.selectedSort === 'priceLowToHigh') {
      filtered.sort(
        (a, b) => Number(a.pricePerPerson) - Number(b.pricePerPerson)
      );
    } else if (this.selectedSort === 'priceHighToLow') {
      filtered.sort(
        (a, b) => Number(b.pricePerPerson) - Number(a.pricePerPerson)
      );
    } else if (this.selectedSort === 'distanceLowToHigh') {
      filtered.sort(
        (a, b) => Number(a.deliveryDistance) - Number(b.deliveryDistance)
      );
    } else if (this.selectedSort === 'distanceHighToLow') {
      filtered.sort(
        (a, b) => Number(b.deliveryDistance) - Number(a.deliveryDistance)
      );
    } else if (this.selectedSort === 'alphabeticalAZ') {
      filtered.sort((a, b) => a.restaurantName.localeCompare(b.restaurantName));
    } else if (this.selectedSort === 'alphabeticalZA') {
      filtered.sort((a, b) => b.restaurantName.localeCompare(a.restaurantName));
    }

    this.filteredRestaurants = filtered;
  }

  resetFilters(): void {
    this.selectedSort = '';
    this.selectedCategory = '';
    this.filteredRestaurants = [...this.restaurants];
  }
}
