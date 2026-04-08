import { DashboardState, Product, Vendor, Customer, OrderFact, ProcurementFact, InventoryFact } from './types';
import { subDays, format, addDays } from 'date-fns';

export const mockProducts: Product[] = [
  { id: 'P1', name: 'Industrial Ethanol', category: 'Chemicals', unitPrice: 850, costPrice: 500, isHazardous: true },
  { id: 'P2', name: 'Polyethylene Resin', category: 'Chemicals', unitPrice: 1200, costPrice: 750, isHazardous: false },
  { id: 'P3', name: 'Laundry Detergent 5L', category: 'FMCG', unitPrice: 15, costPrice: 8, shelfLifeDays: 730 },
  { id: 'P4', name: 'Organic Milk 1L', category: 'FMCG', unitPrice: 4, costPrice: 2, shelfLifeDays: 14 },
  { id: 'P5', name: 'Corrugated Boxes', category: 'Packaging', unitPrice: 0.5, costPrice: 0.2 },
];

export const mockVendors: Vendor[] = [
  { id: 'V1', name: 'Global ChemCorp', location: 'Germany', category: 'Chemicals' },
  { id: 'V2', name: 'AgroPure Farms', location: 'Netherlands', category: 'FMCG' },
  { id: 'V3', name: 'PackRight Solutions', location: 'Poland', category: 'Packaging' },
];

export const mockCustomers: Customer[] = [
  { id: 'C1', name: 'Retail Giant Co', region: 'Europe', segment: 'Enterprise' },
  { id: 'C2', name: 'BioLab Research', region: 'North America', segment: 'Enterprise' },
  { id: 'C3', name: 'QuickMart Stores', region: 'Asia Pacific', segment: 'Retail' },
];

const generateFacts = () => {
  const orders: OrderFact[] = [];
  const procurement: ProcurementFact[] = [];
  
  for (let i = 0; i < 500; i++) {
    const date = subDays(new Date(), Math.floor(Math.random() * 90));
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const customer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
    const qty = Math.floor(Math.random() * 100) + 10;
    
    const requestedDate = format(date, 'yyyy-MM-dd');
    const isDelivered = Math.random() > 0.1;
    const deliveryDate = isDelivered ? format(addDays(date, Math.floor(Math.random() * 3)), 'yyyy-MM-dd') : undefined;
    
    // Simulate partial shipments for OTIF
    const shippedQty = isDelivered ? (Math.random() > 0.15 ? qty : Math.floor(qty * 0.8)) : 0;

    orders.push({
      id: `O${i}`,
      date: requestedDate,
      productId: product.id,
      customerId: customer.id,
      quantity: qty,
      shippedQuantity: shippedQty,
      revenue: shippedQty * product.unitPrice,
      status: isDelivered ? 'Delivered' : 'In Transit',
      requestedDate,
      deliveryDate,
      satisfactionScore: isDelivered ? Math.floor(Math.random() * 3) + 3 : undefined,
      batchNumber: `B-${Math.floor(Math.random() * 10000)}`,
    });
  }

  for (let i = 0; i < 100; i++) {
    const date = subDays(new Date(), Math.floor(Math.random() * 90));
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const vendor = mockVendors[Math.floor(Math.random() * mockVendors.length)];
    const qty = Math.floor(Math.random() * 500) + 100;
    
    const expectedDate = format(addDays(date, 7), 'yyyy-MM-dd');
    const isReceived = Math.random() > 0.05;
    const receivedDate = isReceived ? format(addDays(date, Math.floor(Math.random() * 10)), 'yyyy-MM-dd') : undefined;

    procurement.push({
      id: `PR${i}`,
      date: format(date, 'yyyy-MM-dd'),
      productId: product.id,
      vendorId: vendor.id,
      quantity: qty,
      cost: qty * product.costPrice,
      expectedDate,
      receivedDate,
    });
  }

  const inventory: InventoryFact[] = mockProducts.map(p => ({
    productId: p.id,
    stockLevel: Math.floor(Math.random() * 1000) + 200,
    reorderPoint: 300,
    warehouseLocation: p.isHazardous ? 'HazMat Zone A' : 'Cold Storage B',
    expiryDate: p.shelfLifeDays ? format(addDays(new Date(), Math.floor(Math.random() * 30) - 5), 'yyyy-MM-dd') : undefined,
    batchNumber: `B-${Math.floor(Math.random() * 10000)}`,
  }));

  return { orders, procurement, inventory };
};


const facts = generateFacts();

export const mockDashboardData: DashboardState = {
  products: mockProducts,
  vendors: mockVendors,
  customers: mockCustomers,
  orders: facts.orders,
  procurement: facts.procurement,
  inventory: facts.inventory,
};
