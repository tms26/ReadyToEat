export class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public nif: string,
    public password: string,
    public image: string,
    public role: 'restaurant' | 'customer' | 'admin',
    public restaurantName?: string,
    public address?: string,
    public phone?: string,
    public pricePerPerson?: number,
    public status?: 'in validation' | 'valid',
    public _id?: string,
    public deliveryDistance?: number
  ) {}
}
