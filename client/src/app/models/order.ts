export interface DishItem {
  dish: { nome: string; preco: number; [key: string]: any };
  quantity: number;
}

export class Order {
  constructor(
    public restaurantId: string, 
    public customerId: string, 
    public amount: number, 
    public status: 'Pending' | 'Paid' | 'Cancelled' | 'Preparing' | 'Completed', 
    public dishes: DishItem[], 
    public date?: Date, 
  ) {}
}