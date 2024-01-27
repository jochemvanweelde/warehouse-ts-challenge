export abstract class OrderProduct {
  protected id: string;
  protected productCode: string;
  protected name: string;
  protected description: string;
  protected stock: number;

  constructor({
    id,
    productCode,
    name,
    description,
    stock,
  }: {
    id: string;
    productCode: string;
    name: string;
    description: string;
    stock: number;
  }) {
    this.id = id;
    this.productCode = productCode;
    this.name = name;
    this.description = description;
    this.stock = stock;
  }

  getId(): string {
    return this.id;
  }

  getProductCode(): string {
    return this.productCode;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getStock(): number {
    return this.stock;
  }

  abstract getPrice(): number;

  isStockAvailable(stockNeeded: number): boolean {
    return this.stock >= stockNeeded;
  }

  setStock(stock: number): void {
    this.stock = stock;
  }

  mutateStock(stockDiff: number): boolean {
    if (this.stock + stockDiff < 0) {
      return false;
    }
    this.stock += stockDiff;
    return true;
  }
}
