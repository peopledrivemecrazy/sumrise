import PocketBase from "pocketbase";
import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
import seed_data from './seed_raw_emails.json?raw';

export const logout = () => pb.authStore.clear();

export const resetData = async () => {
    const isUserSuperAdmin = pb.authStore.isSuperuser;
    console.log(pb.authStore)
    if (!isUserSuperAdmin) {
        throw new Error('User is not a super admin');
    }
    console.log(seed_data);
    // const batch = pb.createBatch();

    // // batch.collection('raw_emails').create({})
    // await batch.send();
}