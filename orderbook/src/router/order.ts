import {Router} from "express";

const router=Router();

router.post("/", async (req: any, res: any) => {
    console.log("asjnfkj");
    res.json({message:"hey there1"})
});

router.get("/:orderId", async (req: any, res: any) => {
    res.json({message:"hey there2"})
})


router.delete("/:orderId", async (req: any, res: any) => {
    res.json({message:"hey there3"})
})

router.post("/quote", async (req: any, res: any) => {
    res.json({message:"hey there4"})
})

export const orderRouter=router;