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

export interface IBasket {
    items: ProductBasket[];
    totalPrice: number;
}

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    order: IOrder | null;
}

export interface IOrderPaymentWay {
    method: 'online' | 'uponDelivery';
} 

export interface IOrderForm extends IOrderPaymentWay {
    address: string;
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: [];
    totalPrice: number;
}

export type OrderResult = Pick<IOrder, 'totalPrice'>;