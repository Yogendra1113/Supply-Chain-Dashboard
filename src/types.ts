export interface Product {
  id: string;
  name: string;
  category: 'Chemicals' | 'FMCG' | 'Packaging';
  unitPrice: number;
  costPrice: number;
  isHazardous?: boolean;
  shelfLifeDays?: number;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  region: string;
  segment: 'Retail' | 'Wholesale' | 'Enterprise';
}

export interface OrderFact {
  id: string;
  date: string;
  productId: string;
  customerId: string;
  quantity: number;
  shippedQuantity: number; // For OTIF calculation
  revenue: number;
  status: 'Delivered' | 'In Transit' | 'Pending' | 'Cancelled';
  deliveryDate?: string;
  requestedDate: string;
  satisfactionScore?: number;
  batchNumber?: string;
}

export interface ProcurementFact {
  id: string;
  date: string;
  productId: string;
  vendorId: string;
  quantity: number;
  cost: number;
  receivedDate?: string;
  expectedDate: string;
}

export interface InventoryFact {
  productId: string;
  stockLevel: number;
  reorderPoint: number;
  warehouseLocation: string;
  expiryDate?: string;
  batchNumber?: string;
}

export interface DashboardState {
  products: Product[];
  vendors: Vendor[];
  customers: Customer[];
  orders: OrderFact[];
  procurement: ProcurementFact[];
  inventory: InventoryFact[];
}
