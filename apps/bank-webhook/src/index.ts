import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json())

app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    //if on ramp txn is processing then only the thread should go below and process the request otherwise it should show erorr.
    
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string;
        status : string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount,
        status : req.body.status
    };

    try {
        const OnRampTransaction = await db.onRampTransaction.findUnique({
            where : {
                token : paymentInformation.token
            }
        });

        console.log("transaction fetched is : " , OnRampTransaction);
        if(!OnRampTransaction ) {
            return res.status(400).json({
                message : "Transaction deos not exist"
            })
        };
        if(OnRampTransaction.status == "Success" || OnRampTransaction.status == "Failure"){
            res.status(400).json({
                message : "transaction already compleated"
            })
        };
        if(OnRampTransaction.status === "Processing"){
            //enable transaction in databases and do two events that is update the balance with the given userId and we are doing for transfer for hdfc bank accouont and onramp transaction should be updated as the status as success.

            await db.$transaction([
            
                db.balance.updateMany({
                    where: {
                        userId: Number(paymentInformation.userId)
                    },
                    data: {
                        amount: {
                            // You can also get this from your DB
                            increment: Number(paymentInformation.amount)
                        }
                    }
                }),
                db.onRampTransaction.update({
                    where: {
                        token: paymentInformation.token
                    }, 
                    data: {
                        status: "Success",
                    }
                })
            ]);
    
            res.json({
                message: "Captured"
            })  
        }

        return res.status(400).json({
            message : "transaction is not in processing state"
        })
        
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003);