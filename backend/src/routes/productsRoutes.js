import express from "express";
import prisma from '../prismaClient.js';

const router = express.Router();

// Create a new product
router.post('/add-new-post', async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      isActive = true,
      category_id,
      images,
      variantStocks,
      variationOptionIds,
      price,
      stock_quantity,
      sku,
    } = req.body;

    if (!name || !description || !brand || !category_id) {
      return res.status(400).json({ message: 'Name, description, brand, and category_id are required' });
    }

    const category = await prisma.category.findUnique({
      where: { id: category_id },
    });
    if (!category) {
      return res.status(400).json({ message: 'Invalid category_id' });
    }

    let imageUrls = images || [];
    if (imageUrls.length > 0) {
      imageUrls.forEach((url) => {
        if (!url || typeof url !== 'string' || !url.startsWith('https://')) {
          throw new Error('Invalid image URL');
        }
      });
    }

    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name,
          description,
          brand,
          isActive,
          categoryId: category_id,
          coverImage: imageUrls.length > 0 ? imageUrls[0] : '',
        },
      });

      const productItems = [];

      if (variantStocks && variantStocks.length > 0) {
        for (const variant of variantStocks) {
          const { optionCombination, stock } = variant;

          if (!optionCombination || !Array.isArray(optionCombination) || optionCombination.length === 0) {
            throw new Error('Invalid optionCombination for variant');
          }

          const validOptions = await tx.variationOption.findMany({
            where: { id: { in: optionCombination } },
          });
          if (validOptions.length !== optionCombination.length) {
            throw new Error('One or more variationOptionIds are invalid');
          }

          const generatedSku = `${newProduct.id}-${optionCombination.join('-')}`;

          const productItem = await tx.productItem.create({
            data: {
              price: price || 0,
              stockQuantity: stock || 0,
              sku: generatedSku,
              productId: newProduct.id,
            },
          });

          if (imageUrls.length > 0) {
            await tx.productImage.createMany({
              data: imageUrls.map((imageUrl) => ({
                productId: productItem.id,
                imageUrl,
              })),
            });
          }

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
        if (!sku) {
          return res.status(400).json({ message: 'SKU is required for products without variations' });
        }

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

        if (imageUrls.length > 0) {
          await tx.productImage.createMany({
            data: imageUrls.map((imageUrl) => ({
              productId: productItem.id,
              imageUrl,
            })),
          });
        }

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

// Get products by category
router.get('/by-category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId,
      },
      include: {
        productItem: {
          take: 1,
          include: {
            images: true,
          },
        },
      },
    });

    const formattedProducts = products.map((product) => {
      const firstProductItem = product.productItem[0] || {};
      const imageUrl = firstProductItem.images?.[0]?.imageUrl || product.coverImage || '';

      return {
        id: product.id,
        name: product.name,
        price: firstProductItem.price ? parseFloat(firstProductItem.price) : 0,
        stock_quantity: firstProductItem.stockQuantity || 0,
        stock_total: firstProductItem.stockQuantity || 0,
        image_url: imageUrl,
        active: product.isActive,
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Toggle product status
router.patch('/toggle-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be a boolean' });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isActive },
    });

    res.status(200).json({
      message: 'Product status updated successfully',
      product: {
        id: updatedProduct.id,
        isActive: updatedProduct.isActive,
      },
    });
  } catch (error) {
    console.error('Error toggling product status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;