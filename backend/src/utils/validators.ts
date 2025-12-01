import { body, query, ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
  body('ownerName').trim().notEmpty().withMessage('Yetkili kişi adı gereklidir'),
  body('email').isEmail().withMessage('Geçerli bir email adresi giriniz').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Telefon numarası gereklidir'),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
  body('storeName').trim().notEmpty().withMessage('Mağaza adı gereklidir'),
  body('address.province').trim().notEmpty().withMessage('İl gereklidir'),
  body('address.district').trim().notEmpty().withMessage('İlçe gereklidir'),
  body('address.fullAddress').trim().notEmpty().withMessage('Adres gereklidir'),
];

export const loginValidation: ValidationChain[] = [
  body('email').isEmail().withMessage('Geçerli bir email adresi giriniz').normalizeEmail(),
  body('password').notEmpty().withMessage('Şifre gereklidir'),
];

export const productValidation: ValidationChain[] = [
  body('name').trim().notEmpty().withMessage('Ürün adı gereklidir'),
  body('category').trim().notEmpty().withMessage('Kategori gereklidir'),
  body('price').isFloat({ min: 0 }).withMessage('Geçerli bir fiyat giriniz'),
  body('unit').trim().notEmpty().withMessage('Birim gereklidir'),
  body('stock').isInt({ min: 0 }).withMessage('Geçerli bir stok değeri giriniz'),
];

export const orderStatusValidation: ValidationChain[] = [
  body('status')
    .isIn(['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'])
    .withMessage('Geçersiz sipariş durumu'),
];
