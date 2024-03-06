import {IOrder, OrderResult, IProduct} from "../types";

export interface ILarekAPI {
    getCardList: () => Promise<IProduct[]>;
    getCardItem: (id: string) => Promise<IProduct>;
    sendOrder: (order: IOrder) => Promise<OrderResult>;
}

