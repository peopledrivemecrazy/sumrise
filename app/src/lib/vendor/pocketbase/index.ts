import PocketBase from "pocketbase";
import { PUBLIC_POCKETBASE_URL } from "$env/static/public";

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

export type Transaction = {
    id: string;
    date: string;
    amount_cents: number;
    merchant_name: string;
    card_type: string;
    card_last4: string;
    category: string;
    location?: string;
    raw_email_id: string;
}

export type RawEmail = {
    id: string;
    status: string;
    text_body: string;
    received_date: string;
    error_msg: string;
    retry_count: number;
    message_id: string;
}

export const logout = () => pb.authStore.clear();

