import { OrderProduct } from "./OrderProduct";

export class InstallationMaterial extends OrderProduct {
  protected unitPrice: number;

  constructor({
    id,
    productCode,
    name,
    description,
    stock,
    unitPrice,
  }: {
    id: string;
    productCode: string;
    name: string;
    description: string;
    stock: number;
    unitPrice: number;
  }) {
    super({
      id,
      productCode,
      name,
      description,
      stock,
    });
    this.unitPrice = unitPrice;
  }

  getPrice(): number {
    return this.unitPrice;
  }
}
