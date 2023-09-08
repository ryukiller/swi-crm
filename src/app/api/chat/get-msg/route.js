import { verifyAccessToken } from "@/lib/apiauth";
import { getMessagesFromRedis } from "@/lib/redisdb";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/utils/utils";

import { decrypt } from "@/lib/cryptoMsgs";

export async function GET(req) {
    const unauthorizedResponse = await verifyAccessToken(req);
    if (unauthorizedResponse) {
        return new Response('not allowed', { status: 401 })
    }
    try {
        const url = new URL(req.url)
        const chat = url.searchParams.get("chat")

        console.log(chat)


        const msgs = await getMessagesFromRedis(chat);

        const messages = msgs.map((msg) => {
            return {
                ...msg,
                message: decrypt(msg.message),
            };
        });

        return new Response(JSON.stringify({ messages }), { status: 200 });


    } catch (error) {
        if (error) {
            return new Response(error.message, { status: 500 })
        }

        return new Response('Internal Server Error', { status: 500 })
    }

}