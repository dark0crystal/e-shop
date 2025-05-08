import express from 'express'

const router = express.Router();


// GET all the parent and child categories

router.get('/all', async(req, res)=>{
    const allCategories = await pisma.Category.get({

    })
})



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