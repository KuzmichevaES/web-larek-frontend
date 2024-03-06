export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number | null;
}