import { Card } from "@repo/ui/card"

export const P2PTransfers = ({
    P2Ptransactions
}: {
    P2Ptransactions: {
        time: Date,
        amount: number,
        fromUser : number,
        toUser  : number
    }[]
}) => {
    if (!P2Ptransactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {P2Ptransactions.map(t => <div className="flex justify-between">
                <div>
                    <div className="flex justify-between">
                        <div className="text-sm">
                            From {t.fromUser}
                        </div>
                        <div className="text-sm">
                            To {t.toUser}
                        </div>
                    </div>
                   
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}