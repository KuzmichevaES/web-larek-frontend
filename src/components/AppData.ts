import { Model } from "./base/Model";
import { IProduct, IAppState, IOrder, FormErrors, IOrderFormContacts } from "../types";
import { Basket } from "./Basket";
import { Modal } from "./common/Modal";

export type CatalogChangeEvent = {
    catalog: IProduct[]
};

export class ProductItem extends Model<IProduct> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
};

export class AppState extends Model<IAppState> {
    catalog: IProduct[] = [];
    basket: IProduct[] = [];
    order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0
    };
    formErrors: FormErrors = {};

    addToBasket(item: IProduct): void {
        this.basket.push(item);
        this.emitChanges('itemsListBasket: changed', this.basket);
    };

    removeFromBasket(id: string): void {
        this.basket = this.basket.filter((item) => item.id !== id);
        this.emitChanges('itemsListBasket: changed', this.basket);
    };

    clearBasket(): void {
        this.basket = [];
        this.emitChanges('itemsListBasket: changed', this.basket);
        this.clearOrder();
    };

    clearOrder(): void {
        this.order = {
            payment: '',
            address: '',
            email: '',
            phone: '',
            items: [],
            total: 0
        }
    };

    getTotal(): number {
        return this.basket.reduce((acc, curr) => acc + curr.price, 0);
    };

    prepareOrderData(): void {
        this.order.items = [];
        this.basket.forEach((item) => {
            if (item.price !== null) {
                this.order.items.push(item.id);
            }
        })

        this.order.total = this.getTotal();
    };

    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new ProductItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    };

    isProductInBasket(item: IProduct): boolean {
        return this.basket.includes(item);
    };

    setPreview(item: IProduct) {
        this.emitChanges('preview:changed', item);
    };

    // setBasket(modal: Modal, basket: Basket): void {
    //     modal.render({
    //         content: basket.render({
    //             items: this.basket,
    //             total: this.getTotal()
    //         })
    //     });

    //     if (this.basket.length === 0) {
    //         basket.setButtonState()
    //     }
    // };

    setAddress(value: string): void {
        this.order.address = value;
        this.validateOrderPaymentAddress();
    };

    setPaymentMethod(value: string): void {
        this.order.payment = value;
        this.validateOrderPaymentAddress();
    };

    setContacts(field: keyof IOrderFormContacts, value: string) {
        this.order[field] = value;
        this.validateOrderContacts();
    };

    validateOrderPaymentAddress() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес'
        }
        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать метод оплаты'
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    };

    validateOrderContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    };
}