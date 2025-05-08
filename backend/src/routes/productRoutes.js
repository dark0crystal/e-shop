import express from "express";
import prisma from '../prismaClient.js'

const router = express.Router();


router.post('/add-new-post', async (req, res) => {
        try{
            const {name , description,brand , isActive ,categoryId ,price, sku} = req.body;
            console.log("the name is :",name)
            res.send("product name is:" , name)
        }catch(error){
            res.send("There is error",error)
        }

        // test
        

    

})

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