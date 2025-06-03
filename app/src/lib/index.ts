import type { Transaction } from "./vendor/pocketbase";

// place files you want to import through the `$lib` alias in this folder.
const formatCurrency = (amount: number) => {
    return Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount / 100);
};


// sample data
// combine same merchant name and amount_cents
// shape has Transaction[] type
// 	[
//     {
//         "amount_cents": 2460,
//         "card_last4": "XXXX",
//         "card_type": "Visa",
//         "category": "Uncategorized",
//         "collectionId": "pbc_3174063690",
//         "collectionName": "transactions",
//         "date": "2025-06-05 12:00:00.000Z",
//         "id": "3blk60ea897m5kx",
//         "location": "",
//         "merchant_name": "DevXPostmark Hackathon",
//         "raw_email_id": "uw592j78632592e"
//     },
//     {
//         "amount_cents": 4599,
//         "card_last4": "XXXX",
//         "card_type": "Visa",
//         "category": "Uncategorized",
//         "collectionId": "pbc_3174063690",
//         "collectionName": "transactions",
//         "date": "2025-06-05 12:00:00.000Z",
//         "id": "d01vo0i76ms495o",
//         "location": "",
//         "merchant_name": "Strickland Propane",
//         "raw_email_id": "7i7p4ch20p4h146"
//     },
//     {
//         "amount_cents": 1250,
//         "card_last4": "XXXX",
//         "card_type": "Visa",
//         "category": "Uncategorized",
//         "collectionId": "pbc_3174063690",
//         "collectionName": "transactions",
//         "date": "2025-06-05 12:00:00.000Z",
//         "id": "e9h33674azbf5ad",
//         "location": "",
//         "merchant_name": "Dale's Dead-Bug",
//         "raw_email_id": "el0609px54x569l"
//     },
//     {
//         "amount_cents": 8999,
//         "card_last4": "XXXX",
//         "card_type": "Visa",
//         "category": "Uncategorized",
//         "collectionId": "pbc_3174063690",
//         "collectionName": "transactions",
//         "date": "2025-06-05 12:00:00.000Z",
//         "id": "1of3196rm317m95",
//         "location": "",
//         "merchant_name": "Mega Lo Mart ",
//         "raw_email_id": "pbz41s1s48kr613"
//     },
//     {
//         "amount_cents": 3275,
//         "card_last4": "XXXX",
//         "card_type": "Visa",
//         "category": "Uncategorized",
//         "collectionId": "pbc_3174063690",
//         "collectionName": "transactions",
//         "date": "2025-06-05 12:00:00.000Z",
//         "id": "5i7vzqh01mpp15x",
//         "location": "",
//         "merchant_name": "Strickland Propane",
//         "raw_email_id": "cr2et14sn6v72w5"
//     }
// ]
const groupBy = (array: Transaction[], key: keyof Transaction) => {
    return array.reduce((acc, item) => {
        const group = acc[item[key] as string] || [];
        group.push(item);
        acc[item[key] as string] = group;
        return acc;
    }, {} as Record<string, Transaction[]>);
};

export { formatCurrency, groupBy };