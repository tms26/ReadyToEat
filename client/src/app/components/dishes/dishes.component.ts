import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../../services/cart.service';
import { MenusService } from '../../services/menus.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dishes',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule],
  providers: [CartService],
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css'],
})
export class DishesComponent implements OnInit {
  dishes: any[] = [];
  filteredDishes: any[] = [];
  categories: string[] = [];
  selectedSort: string = '';
  selectedCategory: string = '';
  menuId!: string;
  restaurantId!: string;

  constructor(
    private route: ActivatedRoute,
    private menusService: MenusService,
    private cartService: CartService,
    private toastr: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const menuId = params.get('menuId');
      if (menuId) {
        this.menuId = menuId;
        this.menusService.getDishesByMenuId(menuId).subscribe({
          next: (dishes: any[]) => {
            this.dishes = dishes;
            this.filteredDishes = dishes;
            this.categories = [...new Set(dishes.map((d) => d.categoria))];
          },
          error: (err: any) => {
            console.error('Error searching for dishes:', err);
          },
        });
      }
    });
  }

  applyFilters() {
    let filtered = [...this.dishes];

    if (this.selectedCategory) {
      filtered = filtered.filter((d) => d.categoria === this.selectedCategory);
    }

    if (this.selectedSort === 'priceLowToHigh') {
      filtered.sort((a, b) => a.preco - b.preco);
    } else if (this.selectedSort === 'priceHighToLow') {
      filtered.sort((a, b) => b.preco - a.preco);
    } else if (this.selectedSort === 'prepTimeLowToHigh') {
      filtered.sort((a, b) => a.tempoPreparo - b.tempoPreparo);
    } else if (this.selectedSort === 'prepTimeHighToLow') {
      filtered.sort((a, b) => b.tempoPreparo - a.tempoPreparo);
    } else if (this.selectedSort === 'portionSmallToLarge') {
      filtered.sort(
        (a, b) =>
          this.getPortionSizeValue(a.tamanhoPorcao) -
          this.getPortionSizeValue(b.tamanhoPorcao)
      );
    } else if (this.selectedSort === 'portionLargeToSmall') {
      filtered.sort(
        (a, b) =>
          this.getPortionSizeValue(b.tamanhoPorcao) -
          this.getPortionSizeValue(a.tamanhoPorcao)
      );
    }

    this.filteredDishes = filtered;
  }

  getPortionSizeValue(size: string): number {
    const sizes = ['small', 'medium', 'large'];
    const idx = sizes.indexOf(size.toLowerCase());
    return idx !== -1 ? idx : 0;
  }

  addToCart(dish: any) {
    this.menusService.getMenuById(this.menuId).subscribe({
      next: (menu: any) => {
        const added = this.cartService.addToCart(dish, menu.createdBy);
        if (added) {
          this.toastr.success(
            `${dish.nome} was successfully added to your cart!`
          );
        }
      },
      error: () =>
        alert(
          'An error occurred while retrieving the restaurant for this dish.'
        ),
    });
  }

  resetFilters() {
    this.selectedSort = '';
    this.selectedCategory = '';
    this.filteredDishes = [...this.dishes];
  }
  
  goBack() {
    this.location.back();
  }
}
