import express from "express";
import prisma from '../prismaClient.js';
import { verifyToken } from "./authRoutes.js";



const router = express.Router();

// should add caching here
router.get('/get-ads', async (req, res) => {
    try {
        const ads = await prisma.ad.findFirst({
            where: {
                type: req.params.type
            }
        });
        res.status(200).json(ads);
    } catch (error) {
        res.status(500).json({ message: "Failed to get ads" });
    }
});

export default router;