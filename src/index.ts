import './scss/styles.scss';
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { LarekAPI } from "./components/LarekAPI";
import { AppState, CatalogChangeEvent } from "./components/AppData";
import { EventEmitter } from "./components/base/events";
import { Page } from './components/page';
import { Card } from './components/card';
import { IOrder, IOrderFormContacts, IProduct } from './types';
import { Modal } from './components/common/modal';
import { Basket } from './components/common/basket';
import { OrderContact, OrderPaymentAddress } from './components/order';
import { Success } from './components/common/success';

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderFormContactTemplate = ensureElement<HTMLTemplateElement>('#contacts'); 
const successTemplate = ensureElement<HTMLTemplateElement>('#success'); 

const appData = new AppState({}, events);
const order = new OrderPaymentAddress (cloneTemplate(orderFormTemplate), events);
const orderContact = new OrderContact (cloneTemplate(orderFormContactTemplate), events);

events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:selected', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            category: item.category,
            price: item.price
        });
    });
});

events.on('card:selected', (item: IProduct) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
    const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => events.emit('card:addedToBasket', item)
    });

    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            category: item.category,
            price: item.price,
        })
    });

    if(appData.isProductInBasket(item)) {
        card.setButtonState();
    }
});

events.on('card:addedToBasket', (item: IProduct) => {
    appData.addToBasket(item);
    modal.close();
});

events.on('card:removeFromBasket', (item: IProduct) => {
    appData.removeFromBasket(item.id);
    const basket = new Basket(cloneTemplate(basketTemplate), events);
    appData.setBasket(modal, basket);
});

events.on('itemsListBasket: changed', (basket: IProduct[]) => {
    page.counter = Object.keys(basket).length;
});

events.on('basket:open', () => {
    const basket = new Basket(cloneTemplate(basketTemplate), events);

    appData.setBasket(modal, basket);
});

events.on('order:open', () => {
    modal.render({
        content: order.render({
            payment: 'cash',
            address: '',
            valid: false,
            errors: []
        })
    }) 
})

events.on('paymentMethod:changed', (payment: HTMLButtonElement) => {
    order.setPaymentButtonClass(payment.name);
    appData.setPaymentMethod(payment.name);
})

events.on('order:submit', () => {
    modal.render({
        content: orderContact.render({
            email:'',
            phone: '',
            valid: false,
            errors: []
        })
    }) 
});

events.on('contacts:submit', () => {
    appData.prepareOrderData();
    api.sendOrder(appData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    appData.clearBasket();
                    //events.emit('auction:changed');
                }}, appData.getTotal()
            );

            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error(err);
        })
        .finally(() => {
            appData.clearBasket();
        })
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

//Изменилось поле контакты 
events.on( /^contacts\..*:change/,
    (data: { field: keyof IOrderFormContacts; value: string }) => {  appData.setContacts(data.field, data.value);
});

 //Изменился адрес и способ оплаты
 events.on('order.address:change', (data: { value: string }) => { appData.setAddress(data.value);
 });

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { email, phone, address, payment } = errors;
    order.valid = !address && !payment;
    orderContact.valid = !email && !phone;
    order.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
    orderContact.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });