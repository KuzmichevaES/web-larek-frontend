import {ProductBasket} from "..//..//types"

export interface IBasketView {
    items: HTMLElement[];
    totalPrice: number;
    selected: ProductBasket[];
}

