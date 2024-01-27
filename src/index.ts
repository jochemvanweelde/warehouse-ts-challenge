import { InventoryManager, PrepairNextOrderResult } from "./InventoryManager";

async function main() {
  const inventoryManger = new InventoryManager();

  await Promise.all([
    inventoryManger.fetchHeatPumps(),
    inventoryManger.fetchInstallationMaterials(),
    inventoryManger.fetchTools(),
    inventoryManger.fetchOrders(),
  ]);

  while (
    inventoryManger.prepairAndPrintNextOrder() !==
    PrepairNextOrderResult.NO_MORE_ORDERS
  ) {
    continue;
  }

  inventoryManger.printFailedOrders();

  inventoryManger.printStock();
}

main();
