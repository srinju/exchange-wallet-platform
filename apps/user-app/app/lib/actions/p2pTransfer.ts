"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";


export async function p2pTransfer(to : string , amount : number) {
    const session  = await getServerSession(authOptions);
    const from = session?.user.id;
    if(!from){
        return {
            message : "error while sending money"
        }
    }
    const toUser = await prisma.user.findFirst({
        where : {
            number : to
        }
    });
    if(!toUser){
        return {
            message : "error while sending money"
        }
    }
    
    await prisma.$transaction(async(tx) => {
        
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`; //database locking or row locking that is lock the particular row until the request is being processes and this is to ensure that when if by mistake someone clicks on the send money button multiple times then only one time the request processes

        const fromBalance = await tx.balance.findUnique({
            where : {
                userId : Number(from)
            }
        });
        if(!fromBalance || fromBalance.amount < amount){
            throw new Error("Insufficient funds");
        }
        await tx.balance.update({
            where : {
                userId : Number(from)
            },
            data : {
                amount : {
                    decrement : amount
                }
            }
        });
        await tx.balance.update({
            where : {
                userId : Number(toUser.id)
            },
            data : {
                amount : {
                    increment : amount
                }
            }
        });
        await tx.p2pTransfer.create({ //creates a log of p2p transfers in the p2p table in the database
            data : {
                fromUserId : Number(from),
                toUserId : toUser.id,
                amount,
                timestamp : new Date()
            }
        })
    })
    
}