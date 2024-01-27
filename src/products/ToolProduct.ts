import { OrderProduct } from "./OrderProduct";

export class Tool extends OrderProduct {
  stockToday: number;

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
    super({
      id,
      productCode,
      name,
      description,
      stock,
    });
    this.stockToday = stock;
  }

  getStock(): number {
    return this.stockToday;
  }

  getDailyStock(): number {
    return this.stock;
  }

  getPrice(): number {
    return 0;
  }

  resetStock(): void {
    this.stockToday = this.stock;
  }

  setStock(stock: number): void {
    this.stockToday = stock;
    super.setStock(stock);
  }

  mutateStock(stockDiff: number): boolean {
    if (this.stockToday + stockDiff < 0) {
      return false;
    }
    this.stockToday += stockDiff;
    if (this.stockToday > this.stock) {
      this.stockToday = this.stock;
    }
    return true;
  }
}
