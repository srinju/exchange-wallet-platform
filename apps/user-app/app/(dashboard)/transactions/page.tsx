import { getServerSession } from "next-auth";
import { P2PTransfers } from "../../../components/P2PTransfers";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";


const P2P =async () => {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where : {
            fromUserId : Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        fromUser : t.fromUserId,
        toUser : t.toUserId,
        amount : t.amount,
        time : t.timestamp,
    }))
}


export default async function() {
    const transactions = await P2P();
    return (
        <div className="w-full">
            <P2PTransfers  P2Ptransactions={transactions}/>
        </div>
    )
}