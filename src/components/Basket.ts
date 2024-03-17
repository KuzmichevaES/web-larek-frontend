import { ensureElement, cloneTemplate } from "../utils/utils";
import { IProduct } from "../types"
import { Component } from "./base/Component";
import { EventEmitter } from "./base/Events";
import { ICardActions } from "./Card";

export interface IBasketView {
    items: IProduct[];
    total: number;
}

export interface IBasketItemView {
    counter: number;
    title: string;
    price: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');
        
        this._button.addEventListener('click', () => {
            events.emit('order:open');
        });
    
        this.items = [];
    }

    set items(items: IProduct[]) {
        this._list.replaceChildren();
        if (items.length) {
            const cardBasketPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
            items.forEach((item, index) => {
                const basketItem = new BasketItem(cloneTemplate(cardBasketPreviewTemplate), {
                    onClick: () => this.events.emit('card:removeFromBasket', item)
                });
                const basketItemNode = basketItem.render({
                    title: item.title,
                    price: item.price,
                    counter: index + 1
                });
                this._list.append(basketItemNode);
            })
        }
        this.setButtonState(items);
    }

    set total(total: number) {
        this.setText(this._total, total + ' синапсов');
    }

    setButtonState(items: IProduct[]) {
        if (items.length === 0) {
            this._button.setAttribute('disabled', '');
        } else {
            this._button.removeAttribute('disabled');
        }
    }
}

export class BasketItem extends Component<IBasketItemView> {
    protected _counter: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _deleteButton: HTMLButtonElement;


    constructor(protected container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._counter = container.querySelector('.basket__item-index');
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = container.querySelector('.card__price');
        this._deleteButton = container.querySelector('.basket__item-delete');

        this._deleteButton.addEventListener('click', actions.onClick);
    }

    set counter(value: string) {
        this.setText(this._counter, value);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, value + ' синапсов');
        }
    }
}

