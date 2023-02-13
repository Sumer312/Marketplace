import { Schema, Document, Model } from "mongoose";

interface productType extends Document {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  userId: Schema.Types.ObjectId;
}

interface cartType extends Document {
  productId: Schema.Types.ObjectId;
  quantity: number;
}

interface userType extends Document {
  name: string;
  email: string;
  password: string;
  cart: {
    items: Array<cartType>;
  };
  addToCart(product: productType): void;
  removeFromCart(productId: Schema.Types.ObjectId): void;
  clearCart(): void;
}

interface ordersType extends Document {
  products: [
    {
      product: object;
      quantity: number;
    }
  ];
  user: {
    name: string;
    userId: Schema.Types.ObjectId;
  };
}

export { productType, userType, cartType, ordersType };
