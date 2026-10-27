import { env } from '../utils/env';

export const users = {
  standard: { username: env.standardUser, password: env.standardPassword },
  locked: { username: env.lockedUser, password: env.standardPassword },
  invalid: { username: 'invalid_user', password: 'invalid_password' },
};

export const checkoutCustomer = {
  firstName: 'Alex',
  lastName: 'Tester',
  postalCode: '10001',
};

export const expectedProducts = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];
