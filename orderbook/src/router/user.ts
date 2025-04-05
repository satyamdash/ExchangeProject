import {Router} from "express";
import { loginschema,signupschema } from "../types";
import  {prisma}  from "../db";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { authMiddleware } from "../middleware";
import bcrypt from "bcrypt";

const router=Router();

router.post("/signup", async (req: any, res: any) => {
    console.log("Signup Route");
    const parsedData=signupschema.safeParse(req.body);

    if(!parsedData.success) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const userexists= await prisma.user.findUnique({
        where:{
            email:parsedData.data?.email
        }
    })

    if(userexists)
    {
        return res.status(400).json({ message: "User already exists" });
    }
    const hasedPassword = await bcrypt.hash(parsedData.data.password, 10);

    const user= await prisma.user.create({
        data:
        {
            email:parsedData.data.email,
            name:parsedData.data.name,
            password:hasedPassword
        }
    })

    res.status(200).json({message:"User has signed up"});

});

router.post("/login", async (req: any, res: any) => {
    console.log("Login Route");
    const parsedData=loginschema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({ message: "Invalid data" });
    }

    const userExists = await prisma.user.findUnique({
        where: {
            email: parsedData.data.email,
        },
    });

    if(!userExists) {
        return res.status(400).json({ message: "User does not exist" });
    }

    const passwordMatch = bcrypt.compare(parsedData.data.password, userExists.password);
    
    if(!passwordMatch)
    {
        return res.status(400).json({ message: "Invalid Password" });
    }
    const token = jwt.sign({ id: userExists.id }, JWT_SECRET);

    res.json({ token: token });
});

router.get("/", authMiddleware, async (req: any, res: any) => {
    console.log("user route");
    // @ts-ignore
    console.log("--------------------------------");
    console.log(req.id);
    console.log("--------------------------------");
    const id = req.id;
    const user = await prisma.user.findFirst({
        where: {
            id: id,
        },
        select: {
            email: true,
            name: true,
        },
    });
    res.json({ user: user });
});

export const userRouter = router;