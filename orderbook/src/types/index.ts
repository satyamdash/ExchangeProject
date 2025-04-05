import {z}  from "zod";

export const signupschema=z.object({
    email:z.string().email(),
    name:z.string().min(1),
    password:z.string().min(8)
})

export const loginschema=z.object({
    email:z.string().email(),
    password:z.string()
})

