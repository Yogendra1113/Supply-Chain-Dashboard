import { DashboardState, OrderFact, ProcurementFact } from '../types';
import { differenceInDays, parseISO } from 'date-fns';

export const calculateMeasures = (state: DashboardState) => {
  const { orders, procurement, inventory, products } = state;

  // 1. Inventory Turnover Ratio = COGS / Average Inventory
  const totalCOGS = orders.reduce((acc, o) => {
    const product = products.find(p => p.id === o.productId);
    return acc + (o.quantity * (product?.costPrice || 0));
  }, 0);
  
  const totalInventoryValue = inventory.reduce((acc, i) => {
    const product = products.find(p => p.id === i.productId);
    return acc + (i.stockLevel * (product?.costPrice || 0));
  }, 0);

  const inventoryTurnover = totalCOGS / (totalInventoryValue || 1);

  // 2. Days Inventory Outstanding (DIO) = (Average Inventory / COGS) * 365
  // Using 90 days as our period
  const dio = (totalInventoryValue / (totalCOGS || 1)) * 90;

  // 3. OTIF (On-Time In-Full) %
  const deliveredOrders = orders.filter(o => o.status === 'Delivered' && o.deliveryDate);
  const otifOrders = deliveredOrders.filter(o => {
    const isOnTime = differenceInDays(parseISO(o.deliveryDate!), parseISO(o.requestedDate)) <= 2;
    const isInFull = o.shippedQuantity >= o.quantity;
    return isOnTime && isInFull;
  });
  const otifPercentage = (otifOrders.length / (orders.length || 1)) * 100;

  // 4. Vendor Lead Time (Average)
  const receivedProcurements = procurement.filter(p => p.receivedDate);
  const totalLeadTime = receivedProcurements.reduce((acc, p) => {
    return acc + differenceInDays(parseISO(p.receivedDate!), parseISO(p.date));
  }, 0);
  const avgVendorLeadTime = totalLeadTime / (receivedProcurements.length || 1);

  // 5. Fill Rate % = (Orders Shipped / Orders Received)
  const fillRate = (deliveredOrders.length / (orders.length || 1)) * 100;

  // 6. Cost Variance = (Actual Cost - Standard Cost) / Standard Cost
  const costVariance = procurement.reduce((acc, p) => {
    const product = products.find(prod => prod.id === p.productId);
    const standardCost = p.quantity * (product?.costPrice || 0);
    return acc + (p.cost - standardCost);
  }, 0) / (procurement.reduce((acc, p) => acc + p.cost, 0) || 1) * 100;

  // 7. Customer Satisfaction Score (CSAT)
  const scores = orders.filter(o => o.satisfactionScore !== undefined).map(o => o.satisfactionScore!);
  const avgCsat = scores.reduce((acc, s) => acc + s, 0) / (scores.length || 1);

  // 8. Expiry Risk (FMCG/Chemical Specific)
  const expiredStockValue = inventory.reduce((acc, i) => {
    if (i.expiryDate && parseISO(i.expiryDate) < new Date()) {
      const product = products.find(p => p.id === i.productId);
      return acc + (i.stockLevel * (product?.costPrice || 0));
    }
    return acc;
  }, 0);

  return {
    inventoryTurnover,
    dio,
    otifPercentage,
    avgVendorLeadTime,
    fillRate,
    costVariance,
    avgCsat,
    expiredStockValue,
    totalRevenue: orders.reduce((acc, o) => acc + o.revenue, 0),
    totalOrders: orders.length,
    totalProcurementCost: procurement.reduce((acc, p) => acc + p.cost, 0),
  };
};
