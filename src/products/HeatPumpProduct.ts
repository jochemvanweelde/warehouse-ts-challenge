import { OrderProduct } from "./OrderProduct";

export class HeatPump extends OrderProduct {
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
    description: string | null;
    stock: number;
    unitPrice: number;
  }) {
    super({
      id,
      productCode,
      name,
      description: description || "",
      stock,
    });
    this.unitPrice = unitPrice;
  }

  getPrice(): number {
    return this.unitPrice;
  }
}
