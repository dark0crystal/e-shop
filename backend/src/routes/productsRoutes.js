import express from "express";
import prisma from '../prismaClient.js'

const router = express.Router();


router.post('/add-new-post', async (req, res) => {
    try {
      const { name, description, brand, isActive,  price, sku } = req.body;
  
     
  
      const product = await prisma.product.create({
        data: {
          name,
          description,
          brand,
          isActive,
          categoryId:"6a1a4696-dcbb-4f3f-9f46-d9b6b7c427a6",
          coverImage: "fdasfadfmlasdfm",
        },
      });
      console.log()
      res.status(201).json({
        message: "Product created successfully",
        product,
      });
  
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  });
  

export default router;



//   id             String        
//   name           String
//   description    String
//   brand          String
//   isActive       Boolean    
//   createdAt      DateTime       
//   updatedAt      DateTime        
//   category       Category        
//   categoryId     String
//   coverImage     String

// =====
// ProductItem{
//     id               
//     price          
//     stockQuantity 
//     sku          
//     productId     
//     product       
//     images          
//     productConfig  
//     cartItem       
// }

