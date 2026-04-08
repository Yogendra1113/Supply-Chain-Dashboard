# Power BI Implementation Guide: SupplyChain Pro Dashboard

This guide provides the technical blueprint for replicating the **SupplyChain Pro** dashboard in Power BI Desktop.

---

## 1. Data Model (Star Schema)

### Dimension Tables
| Table | Columns |
| :--- | :--- |
| **DimProduct** | ProductID (PK), ProductName, Category, UnitPrice, CostPrice, ReorderPoint |
| **DimVendor** | VendorID (PK), VendorName, Location, Category, Rating |
| **DimCustomer** | CustomerID (PK), CustomerName, Region, Segment |
| **DimDate** | Date (PK), Year, Quarter, Month, MonthName, WeekNumber |

### Fact Tables
| Table | Columns |
| :--- | :--- |
| **FactOrders** | OrderID (PK), Date, ProductID (FK), CustomerID (FK), Quantity, Revenue, Status, RequestedDate, DeliveryDate, CSAT_Score |
| **FactProcurement** | ProcID (PK), Date, ProductID (FK), VendorID (FK), Quantity, ActualCost, ExpectedDate, ReceivedDate |
| **FactInventory** | ProductID (FK), WarehouseLocation, CurrentStockLevel |

### DimDate (DAX Script)
Create a new table using this DAX:
```dax
DimDate = 
ADDCOLUMNS(
    CALENDARAUTO(),
    "Year", YEAR([Date]),
    "Quarter", "Q" & FORMAT([Date], "Q"),
    "MonthNum", MONTH([Date]),
    "Month", FORMAT([Date], "MMMM"),
    "MonthYear", FORMAT([Date], "MMM-YYYY"),
    "MonthYearSort", FORMAT([Date], "YYYYMM"),
    "Weekday", FORMAT([Date], "dddd"),
    "IsWeekend", IF(WEEKDAY([Date], 2) > 5, "Weekend", "Weekday")
)
```

---

## 2. Sample Dataset (Excel-Ready Structure)

### DimProduct
| ProductID | ProductName | Category | UnitPrice | CostPrice |
| :--- | :--- | :--- | :--- | :--- |
| P1 | Laptop Pro | Electronics | 1200 | 800 |
| P2 | Ergonomic Chair | Furniture | 350 | 200 |

### FactOrders (Sample Rows)
| OrderID | Date | ProductID | CustomerID | Quantity | ShippedQty | Revenue | Status | RequestedDate | DeliveryDate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| O101 | 2026-04-01 | P1 | C1 | 100 | 100 | 85000 | Delivered | 2026-04-01 | 2026-04-03 |
| O102 | 2026-04-02 | P4 | C2 | 500 | 450 | 1800 | Delivered | 2026-04-02 | 2026-04-03 |

---

## 3. Exact DAX Formulas

### Industry Specific Measures (OTIF & Expiry)
```dax
OTIF % (On-Time In-Full) = 
VAR TotalOrders = COUNT(FactOrders[OrderID])
VAR OtifOrders = 
    CALCULATE(
        COUNT(FactOrders[OrderID]),
        DATEDIFF(FactOrders[RequestedDate], FactOrders[DeliveryDate], DAY) <= 2,
        FactOrders[ShippedQty] >= FactOrders[Quantity]
    )
RETURN DIVIDE(OtifOrders, TotalOrders)

Expiry Risk Value = 
SUMX(
    FILTER(FactInventory, FactInventory[ExpiryDate] < TODAY()),
    FactInventory[CurrentStockLevel] * RELATED(DimProduct[CostPrice])
)

FEFO Efficiency = 
// Measures if older batches are being shipped first
DIVIDE(
    CALCULATE(SUM(FactOrders[Quantity]), FactOrders[BatchAge] > 30),
    SUM(FactOrders[Quantity])
)
```

Create a "Measures" table and add the following:

### Core Financials
```dax
Total Revenue = SUM(FactOrders[Revenue])

Total COGS = 
SUMX(
    FactOrders, 
    FactOrders[Quantity] * RELATED(DimProduct[CostPrice])
)

Gross Profit = [Total Revenue] - [Total COGS]
```

### Supply Chain Efficiency
```dax
Inventory Turnover = 
DIVIDE(
    [Total COGS], 
    SUMX(FactInventory, FactInventory[CurrentStockLevel] * RELATED(DimProduct[CostPrice]))
)

DIO (Days Inventory Outstanding) = 
DIVIDE(
    SUMX(FactInventory, FactInventory[CurrentStockLevel] * RELATED(DimProduct[CostPrice])),
    [Total COGS]
) * 365

Fill Rate % = 
DIVIDE(
    CALCULATE(COUNT(FactOrders[OrderID]), FactOrders[Status] = "Delivered"),
    COUNT(FactOrders[OrderID])
)
```

### Logistics & Vendor
```dax
OTD % (On-Time Delivery) = 
VAR DeliveredOrders = CALCULATE(COUNT(FactOrders[OrderID]), NOT(ISBLANK(FactOrders[DeliveryDate])))
VAR OnTimeOrders = 
    CALCULATE(
        COUNT(FactOrders[OrderID]), 
        DATEDIFF(FactOrders[RequestedDate], FactOrders[DeliveryDate], DAY) <= 2
    )
RETURN DIVIDE(OnTimeOrders, DeliveredOrders)

Avg Vendor Lead Time = 
AVERAGEX(
    FILTER(FactProcurement, NOT(ISBLANK(FactProcurement[ReceivedDate]))),
    DATEDIFF(FactProcurement[Date], FactProcurement[ReceivedDate], DAY)
)

Cost Variance % = 
VAR ActualCost = SUM(FactProcurement[ActualCost])
VAR StdCost = SUMX(FactProcurement, FactProcurement[Quantity] * RELATED(DimProduct[CostPrice]))
RETURN DIVIDE(ActualCost - StdCost, StdCost)
```

---

## 4. Dashboard Wireframe Layout

### Page 1: Executive Overview
*   **Top Row (KPI Cards)**: Total Revenue, OTD%, Inventory Turnover, Avg CSAT.
*   **Middle Left (Area Chart)**: Revenue vs Target (X-axis: Month).
*   **Middle Right (Donut Chart)**: Revenue by Product Category.
*   **Bottom (Table)**: Top 5 Customers by Revenue & Fill Rate.
*   **Right Sidebar**: "Insights Panel" (Text box with conditional formatting).

### Page 2: Inventory Analysis
*   **Top Row (KPI Cards)**: DIO, Stock Accuracy %, Obsolete Stock Value.
*   **Left (Bar Chart)**: Stock Value by Category.
*   **Right (Gauge Chart)**: Current Stock vs Safety Stock Levels.
*   **Bottom (Matrix)**: SKU Level Detail (Stock Level, Reorder Point, Status Icon).

### Page 3: Vendor Performance
*   **Top Row (KPI Cards)**: Avg Lead Time, Cost Variance, Vendor Reliability %.
*   **Center (Scatter Plot)**: Lead Time (X) vs Quality Score (Y) by Vendor.
*   **Bottom (Table)**: Vendor Scorecard (Lead Time, Reliability, Cost Var).

---

## 5. Step-by-Step Implementation Guide

1.  **Data Ingestion**:
    *   Import Excel/SQL tables.
    *   Use **Power Query** to ensure `Date` columns are in `Date` format.
    *   Create a `DimDate` table using `CALENDARAUTO()`.

2.  **Modeling**:
    *   Go to the **Model View**.
    *   Connect `DimProduct[ProductID]` to `FactOrders`, `FactProcurement`, and `FactInventory`.
    *   Connect `DimDate[Date]` to `FactOrders[Date]` (Active) and `FactProcurement[Date]` (Inactive).
    *   Ensure all relationships are **One-to-Many (1:*)** and **Single Direction**.

3.  **UI/UX Setup**:
    *   **Theme**: Import a JSON theme or set colors: Primary (#0ea5e9), Secondary (#64748b), Success (#10b981), Danger (#ef4444).
    *   **Background**: Use a light grey (#f8fafc) background with white rounded-corner shapes for "cards".
    *   **Interactivity**: Enable "Edit Interactions" to ensure slicers don't break specific trend lines.

4.  **Advanced Features**:
    *   **Drill-Through**: Create a "Product Detail" page and add `DimProduct[ProductName]` to the drill-through filters.
    *   **Conditional Formatting**: Set background color for "Stock Level" in tables (Red if < Reorder Point).
    *   **Tooltips**: Create a custom tooltip page for the "Revenue by Category" chart to show top 3 products in that category.
