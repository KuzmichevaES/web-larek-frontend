export interface IProduct {
    id: string;
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number | null;
}

export type ProductMain = Pick<IProduct, 'category' | 'id' | 'image' | 'price' | 'title'>;

export type ProductBasket = Pick<IProduct, 'id' | 'price' | 'title'>;

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    order: IOrder | null;
}

export type IOrderPaymentWay = 'card' | 'cash';

export interface IOrderFormPaymentAddress {
    payment: IOrderPaymentWay;
    address: string;
}

export interface IOrderFormContacts {
    email: string;
    phone: string;
}

export interface IOrder {
   items: string[];
   payment: string;
   address: string;
   email: string;
   phone: string;
   total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type OrderResult = Pick<IOrder, 'total'>;