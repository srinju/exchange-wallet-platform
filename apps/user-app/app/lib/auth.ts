import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import {z} from "zod"

const signinSchema = z.object({
    email : z.string().email("invalid email address").nonempty("email is required"),
    number : z.string().min(10,"number should be atleast 10 charecters").nonempty("number is required"),
    password : z.string().min(4,"password should be atleast 4 charecters").nonempty("password is requried"),
})
export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            number: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
            email : {label : 'email' , type : "text" , placeholder : "abcd@gmail.com" , required : true},
            password: { label: "Password", type: "password", required: true }
          },
          //  User credentials type from next-aut
          async authorize(credentials: any) {
            try{
                // Do zod validation, >
                const validatedCredentials = signinSchema.parse(credentials);
                const existingUser = await db.user.findFirst({
                    where: {
                        number: validatedCredentials.number,
                        //email : validatedCredentials.email
                    }
                });
                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(validatedCredentials.password, existingUser.password);
                    if (!passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.email,
                            number : existingUser.number
                        }
                    }
                    return null;
                }
                return null
            } catch(e){
                console.error("error occured " , e);
                return null;
            }
          },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub

            return session;
        }
    }
  }
  