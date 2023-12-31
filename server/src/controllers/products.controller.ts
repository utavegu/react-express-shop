import express from 'express';
import { productsService } from '../services/products.service';
import { getProductsQueryParams } from '../helpers/getProductsQueryParams';

const router = express.Router();

router.get('', async (request, responce) => {
  try {
    const queryParams = getProductsQueryParams(request);
    const res = await productsService.fetchProducts(queryParams);
    responce.status(200).json({
      success: true,
      data: res,
    });
  } catch (error) {
    responce.status(500).json({
      success: false,
      message: 'Ошибка получения товаров',
    });
  }
});

router.get('/:id', async (request, responce) => {
  try {
    const { id } = request.params;
    const product = await productsService.fetchTargetProduct(id);
    if (!product) {
      throw new Error();
    }
    responce.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    responce.status(404).json({
      success: false,
      message: 'Такой товар не найден!',
    });
  }
});

router.post('/migration', async (_, responce) => {
  try {
    const products = await productsService.addProducts();
    if (!products) {
      throw new Error();
    }
    responce.status(201).json({
      success: true,
      message: 'Товары успешно перенесены в базу!',
    });
  } catch (error) {
    responce.status(500).json({
      success: false,
      message: 'Товары уже были перенесены в базу ранее!',
    });
  }
});

router.delete('', async (_, responce) => {
  try {
    await productsService.clearProductsCollection();
    responce.status(200).json({
      success: true,
      message: 'База товаров успешно очищена!',
    });
  } catch (err) {
    console.error(err);
  }
});

export default router;
