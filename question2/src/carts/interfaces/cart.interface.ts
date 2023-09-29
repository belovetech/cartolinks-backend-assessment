export interface Cart {
  id: string;
  numberOfItems: number;
  items: Item[];
  totalAmount: number;
}

export interface Item {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice?: number;
}

export interface CartResponse {
  message: string;
  cart?: Cart;
  Item?: Item;
}
