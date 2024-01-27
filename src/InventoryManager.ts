import { DATA_SERVER_URL } from "./constants";
import { Order } from "./orders/Order";
import { HeatPump } from "./products/HeatPumpProduct";
import { InstallationMaterial } from "./products/InstallationMaterial";
import { OrderProduct } from "./products/OrderProduct";
import { Tool } from "./products/ToolProduct";

export class InventoryManager {
  private heatPumps: HeatPump[] = [];
  private installationMaterials: InstallationMaterial[] = [];
  private tools: Tool[] = [];

  get allProducts(): OrderProduct[] {
    return [...this.heatPumps, ...this.installationMaterials, ...this.tools];
  }

  private orders: Order[] = [];
  private failedOrders: { order: Order; reason: string }[] = [];

  private lastOrderDate: Date = new Date();

  constructor() {}

  //private
  private resetTools() {
    this.tools.forEach((tool) => {
      tool.resetStock();
    });
  }

  //public
  public async fetchHeatPumps() {
    this.heatPumps = await fetch(`${DATA_SERVER_URL}/heatPumps`).then((res) =>
      res.json().then((data: any[]) => data.map((entry) => new HeatPump(entry)))
    );
  }

  public async fetchInstallationMaterials() {
    this.installationMaterials = await fetch(
      `${DATA_SERVER_URL}/installationMaterials`
    ).then((res) =>
      res
        .json()
        .then((data: any[]) =>
          data.map((entry) => new InstallationMaterial(entry))
        )
    );
  }

  public async fetchTools() {
    this.tools = await fetch(`${DATA_SERVER_URL}/tools`).then((res) =>
      res.json().then((data: any[]) => data.map((entry) => new Tool(entry)))
    );
  }

  public async fetchOrders() {
    this.orders = await fetch(`${DATA_SERVER_URL}/orders`).then((res) =>
      res.json().then((data: any[]) => data.map((entry) => new Order(entry)))
    );
    this.orders.sort(
      (a, b) => a.installationDate.getTime() - b.installationDate.getTime()
    );
  }

  public prepairAndPrintNextOrder() {
    const nextOrder = this.orders.shift();
    if (!nextOrder) {
      console.warn("No more orders");
      return PrepairNextOrderResult.NO_MORE_ORDERS;
    }

    // Tools can be reused if the next order is on the next day
    // This fails when new orders are added to the list with a date preceding the last order
    if (nextOrder.installationDate != this.lastOrderDate) {
      this.resetTools();
      this.lastOrderDate = nextOrder.installationDate;
    }

    let isOrderPossibleResult: PrepairNextOrderResult =
      PrepairNextOrderResult.SUCCESS;
    const isOrderPossible = Array.from(nextOrder.productMap.entries()).every(
      ([productId, amount]) => {
        const product = this.allProducts.find(
          (product) => product.getId() === productId
        );
        if (!product) {
          isOrderPossibleResult = PrepairNextOrderResult.PRODUCT_NOT_FOUND;
          return false;
        }
        if (!product.isStockAvailable(amount)) {
          isOrderPossibleResult = PrepairNextOrderResult.PRODUCT_NOT_IN_STOCK;
          return false;
        }
        return true;
      }
    );

    if (!isOrderPossible) {
      console.warn(`Order ${nextOrder.id} is not possible`);
      this.failedOrders.push({
        order: nextOrder,
        reason: isOrderPossibleResult,
      });
      return isOrderPossibleResult;
    }

    const totalResult = Array.from(nextOrder.productMap.entries()).map(
      ([productId, amount]) => {
        const product = this.allProducts.find(
          (product) => product.getId() === productId
        )!;
        product.mutateStock(-amount);
        return {
          productId: product.getId(),
          productName: product.getName(),
          productDescription: product.getDescription(),
          productPrice: product.getPrice(),
          productAmount: amount,
          totalPrice: parseFloat((product.getPrice() * amount).toFixed(2)),
        };
      }
    );

    const sumTotalResult = totalResult.reduce(
      (acc, product) => {
        acc.totalProducts += product.productAmount;
        acc.invoicePrice += product.totalPrice;
        acc.invoicePrice = parseFloat(acc.invoicePrice.toFixed(2));
        return acc;
      },
      { totalProducts: 0, invoicePrice: 0 }
    );

    console.table(totalResult);
    console.log(
      `Total products: ${sumTotalResult.totalProducts}, Total price: ${sumTotalResult.invoicePrice}`
    );
    return PrepairNextOrderResult.SUCCESS;
  }

  public printFailedOrders() {
    console.table(
      this.failedOrders.map((failedOrder) => {
        return {
          id: failedOrder.order.id,
          installationDate: failedOrder.order.installationDate
            .toISOString()
            .split("T")[0],
          reason: failedOrder.reason,
        };
      })
    );
  }

  public printStock() {
    console.log("HeatPumps");
    console.table(
      this.heatPumps.map((heatPump) => {
        return {
          id: heatPump.getId(),
          productCode: heatPump.getProductCode(),
          name: heatPump.getName(),
          description: heatPump.getDescription(),
          stock: heatPump.getStock(),
        };
      })
    );

    console.log("InstallationMaterials");
    console.table(
      this.installationMaterials.map((installationMaterial) => {
        return {
          id: installationMaterial.getId(),
          productCode: installationMaterial.getProductCode(),
          name: installationMaterial.getName(),
          description: installationMaterial.getDescription(),
          stock: installationMaterial.getStock(),
        };
      })
    );

    console.log("Tools");
    console.table(
      this.tools.map((tool) => {
        return {
          id: tool.getId(),
          productCode: tool.getProductCode(),
          name: tool.getName(),
          description: tool.getDescription(),
          stock: tool.getDailyStock(),
        };
      })
    );
  }
}

export enum PrepairNextOrderResult {
  SUCCESS = "success",
  NO_MORE_ORDERS = "no more orders",
  PRODUCT_NOT_FOUND = "product not found",
  PRODUCT_NOT_IN_STOCK = "product not in stock",
}
