"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";



export async function createOnrampTransaction(amount : number , provider : string  ) {
    const session = await getServerSession(authOptions);
    const token = Math.random().toString(); //in the real world we send a token to the banking server that a particular user with this amount is going to your page to do transactiomn
    const userId  = session?.user.id;
    if(!userId) {
        return {
            message : "User not logged in"
        }
    }
    await prisma.onRampTransaction.create({
        data : {
            userId : Number(userId),
            amount : amount*100,
            status : "Processing",
            startTime : new Date(),
            provider : provider,
            token : token
        }
    });

    return {
        message : "On ramp transaction added!"
    }
}