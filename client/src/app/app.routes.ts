import { Routes } from '@angular/router';
import { DishesComponent } from './components/dishes/dishes.component';
import { RestaurantsComponent } from './components/restaurants/restaurants.component';
import { RestaurantMenusComponent } from './components/restaurant-menus/restaurant-menus.component';
import { OrderComponent } from './components/order/order.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DishDetailsComponent } from './components/dish-details/dish-details.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { ProfileEditComponent } from './components/user/profile-edit/profile-edit.component';
import { ProfileSecurityComponent } from './components/user/profile-security/profile-security.component';
import { ProfileChartComponent } from './components/user/profile-chart/profile-chart.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/auth/register/register.component';

export const routes: Routes = [
  { path: 'dishes', component: DishesComponent, canActivate: [AuthGuard] },
  { path: 'dishes/:dishId/details', component: DishDetailsComponent, canActivate: [AuthGuard] },
  { path: 'restaurants', component: RestaurantsComponent, canActivate: [AuthGuard] },
  { path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard] },
  { path: 'restaurants/:restaurantId/menus', component: RestaurantMenusComponent, canActivate: [AuthGuard] },
  { path: 'menus/:menuId/dishes', component: DishesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'user/profile/edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'user/profile/security', component: ProfileSecurityComponent, canActivate: [AuthGuard] },
  { path: 'user/profile/chart', component: ProfileChartComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrderComponent, canActivate: [AuthGuard] },
  {path: 'register', component: RegisterComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
