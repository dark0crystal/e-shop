import express from 'express'
import prisma from '../prismaClient.js'
const router = express.Router();


// GET all the parent and child categories
// fetch only parent categories
// fetch child categories
router.get('/all', async(req, res)=>{
    try{
    const allCategories = await pisma.Category.findMany({
        where:{
            parentCategoryId:null,
        },
        include:{
            subcategories:true
        }
    });
    res.status(200).json(allCategories);
    }catch(error){
        res.send("There is an error:",error)
    }
})


// sample json output of all
// [
//     {
//       "id": "1",
//       "name": "Clothing",
//       "description": "All kinds of clothing",
//       "slug": "clothing",
//       "subcategories": [
//         {
//           "id": "2",
//           "name": "Shirts",
//           "parentCategoryId": "1",
//           ...
//         },
//         {
//           "id": "3",
//           "name": "Pants",
//           "parentCategoryId": "1",
//           ...
//         }
//       ]
//     }
//   ]


//====================================================

router.get('/all-categories-varients', async (req, res) => {
    try {
      const allCategories = await prisma.category.findMany({
        where: {
          parentCategoryId: null, // Only parent categories
        },
        include: {
          subcategories: {
            include: {
              variation: {
                include: {
                  variationOption: true,
                },
              },
            },
          },
          variation: {
            include: {
              variationOption: true,
            },
          },
        },
      });
  
      res.status(200).json(allCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // sample output of /all-categories-varients

// [
//     {
//       "id": "parent-1",
//       "name": "Clothing",
//       "subcategories": [
//         {
//           "id": "child-1",
//           "name": "T-Shirts",
//           "variation": [
//             {
//               "id": "var-1",
//               "name": "Size",
//               "variationOption": [
//                 { "id": "opt-1", "value": "S" },
//                 { "id": "opt-2", "value": "M" },
//                 { "id": "opt-3", "value": "L" }
//               ]
//             },
//             {
//               "id": "var-2",
//               "name": "Color",
//               "variationOption": [
//                 { "id": "opt-4", "value": "Red" },
//                 { "id": "opt-5", "value": "Blue" }
//               ]
//             }
//           ]
//         },
//         {
//           "id": "child-2",
//           "name": "Shoes",
//           "variation": []
//         }
//       ],
//       "variation": []
//     }
//   ]
  


//====================================================


router.post('/add-parent-category' ,async (req , res )=>{
    try{
        const { name, slug } = req.body;
        console.log(name , slug)
        if (!name || !slug) {
            return res.status(400).json({ message: 'Name and slug are required.' });
          }
    const newCategory = await prisma.category.create({
        data:{
            name,
            slug
        }
    })
    res.status(200).json({message:"parent category added successfuly !",newCategory})
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
    
})



//====================================================

// add child category 
router.post("/add-child-category" , async(req, res)=>{
    try{
        const {name , slug , parentCategoryId} = req.body;

    if(!name || !slug || !parentCategoryId){
        res.status(400).json({message:"properties not found"})
    }
    const childCategory = await prisma.category.create({
        data:{
            name,
            slug,
            parentCategoryId
        }
    })

    res.status(200).json({message:"child category added successfully", childCategory})

    }catch(error){
        res.status(400).json({message:"Internal server error", error})
    }
})

export default router;



// model Category {
//     id                String     @id @default(uuid())
//     name              String     @unique
//     description       String?
//     parentCategoryId  String?    @map("parent_category_id")
//     createdAt         DateTime   @default(now()) @map("created_at")
//     updatedAt         DateTime   @updatedAt @map("updated_at")
//     slug              String     @unique
//     parentCategory    Category?  @relation("CategoryHierarchy", fields: [parentCategoryId], references: [id])
//     subcategories     Category[] @relation("CategoryHierarchy")
//     products          Product[]
//     variation         Variation[]
//     promotionCategory   PromotionCategory[]
//   }


// model Variation{
//     id         String   @id @default(uuid())
//     categoryId String 
//     name String 
//     category    Category @relation(fields: [categoryId],references: [id])
//     variationOption            VariationOption[]
//     // productConfig              ProductConfig[]
    
//   }
  
//   model VariationOption{
//       id         String   @id @default(uuid())
//       value     String
//       variationId String
//       variation   Variation @relation(fields: [variationId], references: [id])
//       productConfig    ProductConfig[]
//   }



