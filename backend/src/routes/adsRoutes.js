import express from "express";
import prisma from '../prismaClient.js';
import { verifyToken } from "./authRoutes.js";



const router = express.Router();

//---------------------------------

// should add caching here
router.get('/get-ads/wide', async (req, res) => {
    try {
        const ads = await prisma.ad.findFirst({
            where: {
                type: "wide"
            },
            select: {
                image_url: true
            }
        });
        res.status(200).json(ads.image_url);
    } catch (error) {
        res.status(500).json({ message: "Failed to get ads" });
    }
});

//---------------------------------
// create wide ad

router.post('/create-ad', async (req, res) => {
    try {
        console.log("req.body", req.body);
        const { image_url, type } = req.body;
        // store the image url and type in the database
        const ad = await prisma.ad.create({
            data: {
                image_url: image_url,
                type: type
            }
        });
        res.status(200).json(ad);
    } catch (error) {
        console.error("Error creating ad:", error);
        res.status(500).json({ message: "Failed to create ad" });
    }
});



//---------------------------------



export default router;