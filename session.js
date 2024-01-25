'use server'

import { auth } from "./auth";

export const session = async () => {
    return await auth()
}
