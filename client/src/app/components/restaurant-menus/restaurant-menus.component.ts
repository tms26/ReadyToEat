import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-restaurant-menus',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './restaurant-menus.component.html',
  styleUrls: ['./restaurant-menus.component.css']
})
export class RestaurantMenusComponent implements OnInit {
  menus: any[] = [];
  restaurantId!: string;

  constructor(private route: ActivatedRoute,  private restaurantService : RestaurantService, private location: Location) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const restaurantId = params.get('restaurantId');
      if (restaurantId) {
        this.restaurantId = restaurantId;

        this.restaurantService.getMenusByRestaurantId(restaurantId).subscribe({
          next: (menus: any[]) => {
            this.menus = menus;
            this.menus.forEach(menu =>
              console.log(`Menu: ${menu.nome}, Imagem: ${menu.imagem}`)
            );
          },
          error: (err: any) => {
            console.error('Erro ao procurar menus:', err);
          }
        });
      }
    });
  }

  goBack() {
    this.location.back();
  }
}