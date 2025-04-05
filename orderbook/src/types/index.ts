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


export const OrderInputSchema = z.object({
    baseAsset: z.string(),
    quoteAsset: z.string(),
    price: z.number(),
    quantity: z.number(),
    side: z.enum(['buy', 'sell']),
    type: z.enum(['limit', 'market']),
    kind: z.enum(['ioc']).optional(),
  });

