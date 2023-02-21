import { Schema, Document, Model } from "mongoose";
import multer from "multer";

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

declare module "express-serve-static-core" {
  interface Request {
    user: HydratedDocument<userType>;
  }
}

declare module "express-session" {
  interface SessionData {
    isLoggedIn: boolean;
    user: HydratedDocument<userType>;
  }
}

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export {
  productType,
  userType,
  cartType,
  ordersType,
  DestinationCallback,
  FileNameCallback,
};
