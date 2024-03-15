import { IOrderFormContacts, IOrderFormPaymentAddress } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./common/form";

export class OrderPaymentAddress extends Form<IOrderFormPaymentAddress> {
    protected _buttonsPayment: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._buttonsPayment = Array.from(container.querySelectorAll('.button_alt'));
        this._buttonsPayment.forEach(button => {
            button.addEventListener('click', () => {
                events.emit('paymentMethod:changed', button);
            })
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    setPaymentButtonClass(name: string): void { 
        this._buttonsPayment.forEach((button) => { 
            this.toggleClass(button, "button_alt-active", button.name === name); 
        }); 
    }
};

export class OrderContact extends Form<IOrderFormContacts> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
};