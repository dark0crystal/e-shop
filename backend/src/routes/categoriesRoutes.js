import express from 'express'

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

// sample json output
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