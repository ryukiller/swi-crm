import { verifyAccessToken } from "@/lib/apiauth";
import { saveMessageToRedis } from "@/lib/redisdb";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/utils/utils";

import { encrypt, decrypt } from "@/lib/cryptoMsgs";

export async function POST(req) {
    const unauthorizedResponse = await verifyAccessToken(req);
    if (unauthorizedResponse) {
        return new Response('not allowed', { status: 401 })
    }
    try {
        const body = await req.json();
        console.log('Received request body:', body);

        const { sender, chat, username, avatar, time } = body;
        let { message } = body

        const response = await pusherServer.trigger(chat, "chat-event", {
            message,
            sender,
            username,
            avatar,
            time
        });

        // save the encrypted version to redis
        message = encrypt(message);

        const messageObject = {
            message: message,
            sender,
            username,
            avatar,
            time
        };
        //const serializedMessage = JSON.stringify(messageObject);

        const messageId = new Date().getTime().toString(); // or any other unique identifier
        await saveMessageToRedis(chat, messageObject);

        return new Response({ message: "messaggio inviato" }, { status: 200 })

    } catch (error) {
        if (error) {
            return new Response(error.message, { status: 500 })
        }

        return new Response('Internal Server Error', { status: 500 })
    }

}