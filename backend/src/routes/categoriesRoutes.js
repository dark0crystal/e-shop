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
// get the parent categories only 

router.get('/get-parent-categories' , async(req ,res)=>{
  try{  
    const parentCategories = await prisma.categories.findMany({
        where:{
          parentCategoryId :null
        }
    })
    console.log(parentCategories)
    res.status(200).json(parentCategories)
  }catch(error){
    res.status(404).json({message:"can't get the parent categoreis"});
  }
})
//====================================================
// get all the parent and child categories , also the varuents and varients options
// Get all categories, subcategories, variations, and options
router.get('/all-categories-variants', async (req, res) => {
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


// Add parent category
router.post('/add-parent-category', async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const existingCategory = await prisma.category.findUnique({ where: { slug } });
      if (existingCategory) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
      const newCategory = await prisma.category.create({
        data: { name, slug },
      });
      res.status(200).json({ message: 'Parent category added successfully', newCategory });
    } catch (error) {
      console.error('Error adding parent category:', error);
      res.status(400).json({ message: 'Internal server error', error });
    }
  });


//====================================================

// Add child category
router.post('/add-child-category', async (req, res) => {
    try {
      const { name, parentCategoryId } = req.body;
      if (!name || !parentCategoryId) {
        return res.status(400).json({ message: 'Name and parentCategoryId are required' });
      }
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const existingCategory = await prisma.category.findUnique({ where: { slug } });
      if (existingCategory) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
      const childCategory = await prisma.category.create({
        data: { name, slug, parentCategoryId },
      });
      res.status(200).json({ message: 'Child category added successfully', childCategory });
    } catch (error) {
      console.error('Error adding child category:', error);
      res.status(400).json({ message: 'Internal server error', error });
    }
  });


// =======================================
// Add variant
router.post('/add-variant', async (req, res) => {
    try {
      const { name, categoryId, options } = req.body;
      if (!name || !categoryId) {
        return res.status(400).json({ message: 'Name and categoryId are required' });
      }
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const existingVariation = await prisma.variation.findUnique({ where: { slug } });
      if (existingVariation) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
      const variation = await prisma.variation.create({
        data: {
          name,
          slug,
          categoryId,
        },
      });
      const variationOptions = options
        ? await prisma.variationOption.createMany({
            data: options.map((value) => ({
              variationId: variation.id,
              value,
            })),
          })
        : [];
      res.status(200).json({
        message: 'Variant added successfully',
        variation: {
          ...variation,
          variationOptions: variationOptions.count ? options : [],
        },
      });
    } catch (error) {
      console.error('Error adding variant:', error);
      res.status(400).json({ message: 'Internal server error', error });
    }
  });

// =======================================

// Add variation options
router.post('/add-variation-options', async (req, res) => {
    try {
      const { variationId, options } = req.body;
      if (!variationId || !options || !Array.isArray(options) || options.length === 0) {
        return res.status(400).json({ message: 'variationId and non-empty options array are required' });
      }
      const variation = await prisma.variation.findUnique({
        where: { id: variationId },
      });
      if (!variation) {
        return res.status(404).json({ message: 'Variation not found' });
      }
      const createdOptions = await prisma.variationOption.createMany({
        data: options.map((value) => ({
          variationId,
          value,
        })),
      });
      res.status(200).json({
        message: 'Variation options added successfully',
        variationId,
        options: options.map((value, index) => ({
          id: `new-option-${index}-${Date.now()}`,
          value,
        })),
      });
    } catch (error) {
      console.error('Error adding variation options:', error);
      res.status(400).json({ message: 'Internal server error', error });
    }
  });
  // =======================================

  // Edit parent category
router.put('/edit-parent-category/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const existingCategory = await prisma.category.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existingCategory) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: { name, slug },
      });
      res.status(200).json({ message: 'Parent category updated successfully', updatedCategory });
    } catch (error) {
      console.error('Error updating parent category:', error);
      res.status(400).json({ message: 'Internal server error', error });
    }
  });

// =======================================
// Edit child category
router.put('/edit-child-category/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const existingCategory = await prisma.category.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existingCategory) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: { name, slug },
      });
      res.status(200).json({ message: 'Child category updated successfully', updatedCategory });
    } catch (error) {
      console.error('Error updating child category:', error);
      res.status(400).json({ message: 'Internal server error', error });
    }
  });
// =======================================
// Edit variant
router.put('/edit-variant/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const existingVariation = await prisma.variation.findFirst({
        where: { slug, id: { not: id } },
      });
      if (existingVariation) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
      const updatedVariation = await prisma.variation.update({
        where: { id },
        data: { name, slug },
      });
      res.status(200).json({ message: 'Variant updated successfully', updatedVariation });
    } catch (error) {
      console.error('Error updating variant:', error);
      res.status(400).json({ message: 'Internal server error', error });
    }
  });
// =======================================
// Edit variation option
router.put('/edit-variation-option/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { value } = req.body;
      if (!value) {
        return res.status(400).json({ message: 'Value is required' });
      }
      const updatedOption = await prisma.variationOption.update({
        where: { id },
        data: { value },
      });
      res.status(200).json({ message: 'Variation option updated successfully', updatedOption });
    } catch (error) {
      console.error('Error updating variation option:', error);
      res.status(400).json({ message: 'Internal server error', error });
    }
  });
  // =======================================
  // Delete parent category
  router.delete('/delete-parent-category/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.category.delete({
        where: { id },
      });
      res.status(200).json({ message: 'Parent category deleted successfully' });
    } catch (error) {
      console.error('Error deleting parent category:', error);
      res.status(400).json({ message: 'Internal server error', error });
    }
  });
  // =======================================
// Delete child category
router.delete('/delete-child-category/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.category.delete({
        where: { id },
      });
      res.status(200).json({ message: 'Child category deleted successfully' });
    } catch (error) {
      console.error('Error deleting child category:', error);
      res.status(400).json({ message: 'Internal server error', error });
    }
  });
  // =======================================
  // Delete variant
router.delete('/delete-variant/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.variation.delete({
        where: { id },
      });
      res.status(200).json({ message: 'Variant deleted successfully' });
    } catch (error) {
      console.error('Error deleting variant:', error);
      res.status(400).json({ message: 'Internal server error', error });
    }
  });
  // =======================================
  // Delete variation option
router.delete('/delete-variation-option/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.variationOption.delete({
        where: { id },
      });
      res.status(200).json({ message: 'Variation option deleted successfully' });
    } catch (error) {
      console.error('Error deleting variation option:', error);
      res.status(400).json({ message: 'Internal server error', error });
    }
  });
  // =======================================
  // =======================================

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



