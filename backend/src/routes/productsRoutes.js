import express from "express";
import prisma from '../prismaClient.js';

const router = express.Router();

router.post('/add-new-post', async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      isActive = true,
      category_id,
      images, // Array of Supabase public URLs
      variantStocks,
      variationOptionIds,
      price,
      stock_quantity,
      sku,
    } = req.body;

    // Validate required fields
    if (!name || !description || !brand || !category_id) {
      return res.status(400).json({ message: 'Name, description, brand, and category_id are required' });
    }

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: category_id },
    });
    if (!category) {
      return res.status(400).json({ message: 'Invalid category_id' });
    }

    // Validate images (optional, but ensure they are valid URLs if provided)
    let imageUrls = images || [];
    if (imageUrls.length > 0) {
      imageUrls.forEach((url) => {
        if (!url || typeof url !== 'string' || !url.startsWith('https://')) {
          throw new Error('Invalid image URL');
        }
      });
    }

    // Start a transaction to ensure data consistency
    const product = await prisma.$transaction(async (tx) => {
      // Create the Product
      const newProduct = await tx.product.create({
        data: {
          name,
          description,
          brand,
          isActive,
          categoryId: category_id,
          coverImage: imageUrls.length > 0 ? imageUrls[0] : '', // Use first image as cover
        },
      });

      // Handle ProductItem(s)
      const productItems = [];

      if (variantStocks && variantStocks.length > 0) {
        // Variations exist: create a ProductItem for each variant combination
        for (const variant of variantStocks) {
          const { optionCombination, stock } = variant;

          // Validate variationOptionIds
          if (!optionCombination || !Array.isArray(optionCombination) || optionCombination.length === 0) {
            throw new Error('Invalid optionCombination for variant');
          }

          // Verify all variationOptionIds exist
          const validOptions = await tx.variationOption.findMany({
            where: { id: { in: optionCombination } },
          });
          if (validOptions.length !== optionCombination.length) {
            throw new Error('One or more variationOptionIds are invalid');
          }

          // Generate a unique SKU for each ProductItem
          const generatedSku = `${newProduct.id}-${optionCombination.join('-')}`;

          // Create ProductItem
          const productItem = await tx.productItem.create({
            data: {
              price: price || 0,
              stockQuantity: stock || 0,
              sku: generatedSku,
              productId: newProduct.id,
            },
          });

          // Create ProductImage records for this ProductItem
          if (imageUrls.length > 0) {
            await tx.productImage.createMany({
              data: imageUrls.map((imageUrl) => ({
                productId: productItem.id,
                imageUrl,
              })),
            });
          }

          // Create ProductConfig records to link variation options
          await tx.productConfig.createMany({
            data: optionCombination.map((variationOptionId) => ({
              productItemId: productItem.id,
              variationOptionId,
            })),
          });

          productItems.push({
            ...productItem,
            images: imageUrls,
            variationOptionIds: optionCombination,
          });
        }
      } else {
        // No variations: create a single ProductItem
        if (!sku) {
          return res.status(400).json({ message: 'SKU is required for products without variations' });
        }

        // Check for duplicate SKU
        const existingItem = await tx.productItem.findUnique({ where: { sku } });
        if (existingItem) {
          throw new Error('SKU already exists');
        }

        const productItem = await tx.productItem.create({
          data: {
            price: price || 0,
            stockQuantity: stock_quantity || 0,
            sku,
            productId: newProduct.id,
          },
        });

        // Create ProductImage records
        if (imageUrls.length > 0) {
          await tx.productImage.createMany({
            data: imageUrls.map((imageUrl) => ({
              productId: productItem.id,
              imageUrl,
            })),
          });
        }

        // Create ProductConfig records if variationOptionIds are provided
        if (variationOptionIds && variationOptionIds.length > 0) {
          const validOptions = await tx.variationOption.findMany({
            where: { id: { in: variationOptionIds } },
          });
          if (validOptions.length !== variationOptionIds.length) {
            throw new Error('One or more variationOptionIds are invalid');
          }

          await tx.productConfig.createMany({
            data: variationOptionIds.map((variationOptionId) => ({
              productItemId: productItem.id,
              variationOptionId,
            })),
          });
        }

        productItems.push({
          ...productItem,
          images: imageUrls,
          variationOptionIds: variationOptionIds || [],
        });
      }

      return {
        ...newProduct,
        productItems,
      };
    });

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;