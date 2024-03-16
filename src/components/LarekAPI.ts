import { IOrder, OrderResult, IProduct } from "../types";
import { Api, ApiListResponse } from "./base/Api";

export interface ILarekAPI {
    getProductList: () => Promise<IProduct[]>;
    getProduct: (id: string) => Promise<IProduct>;
    sendOrder: (order: IOrder) => Promise<OrderResult>;
}

export class LarekAPI extends Api implements ILarekAPI {

    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    };

    getProductList(): Promise<IProduct[]> {
        return this.get('/product').then(
            (data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    };

    getProduct(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    };

    sendOrder(order: IOrder): Promise<OrderResult> {
        return this.post('/order', order).then(
            (data: OrderResult) => data
        );
    }
}
