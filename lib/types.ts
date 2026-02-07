export interface Order {
    id: string;
    order_id: string;
    customer_name: string;
    customer_email: string;
    contact_number: string;
    home_address: string;
    entity: string;
    attending_event: boolean;
    total_items: number;
    total_amount: number; // Keep as string/number depending on pg parsing, usually string for decimal
    order_date: string;
    order_items_summary: string;
    email_sent: boolean;
    has_merch_pack: boolean;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    item_id: string;
    item_name: string;
    item_size?: string;
    price: number;
    quantity: number;
    total_price: number;
    tshirt_size?: string;
    wristband_color?: string;
    item_color?: string;
    is_merch_pack: boolean;
    merch_pack_id?: string;
    created_at: string;
}
