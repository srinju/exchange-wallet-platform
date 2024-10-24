import prisma from "@repo/db/client";
import { NextResponse } from "next/server";
import {z} from "zod"
import bcrypt from "bcrypt";


const signupSchema = z.object({
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    password: z.string().min(4, "Password must be at least 4 characters").nonempty("Password is required"),
    name : z.string().min(3 , "name must be atleast 3 charecters long").nonempty("name is required"),
    number : z.string().min(10,"number should be atleast 10 charecters long").nonempty("number is required"),

})
export async function POST(req : Request) {
    try {
        const body = await req.json(); //take the json
        const validateData = signupSchema.parse(body);//validate the taken data
        const existingUser = await prisma.user.findUnique({
            where : {
                email : validateData.email,
            }
        });
        if(existingUser){
            return NextResponse.json({
                message : "An user with this email adress already exists"
            },{
                status : 409,
            });
        };
        const hashedPassword = await bcrypt.hash(validateData.password,10);
        const newUser = await prisma.user.create({
            data : {
                email : validateData.email,
                password : hashedPassword,
                name : validateData.name,
                number : validateData.number,
            }
        });
        if(!newUser){
            throw new Error("error occured while creating new user");
        }
        const balance = await prisma.balance.create({
            data : {
                userId: newUser.id,
                amount : 0,
                locked : 0
            }
        });
        if(!balance){
            return {
                message : "error while creating balance for the newly created user"
            }
        };
        return NextResponse.json({
            user : newUser,
            balance : balance,
            message : "user created successfully"
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message : "error occured "
        },{
            status : 500
        });
    }
}