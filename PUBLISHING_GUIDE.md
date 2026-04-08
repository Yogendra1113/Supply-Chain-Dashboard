# Step-by-Step: Publishing your SupplyChain Pro Dashboard to Power BI

Follow these 4 phases to move from this design to a live, published Power BI report.

---

## Phase 1: Prepare Your Data (Excel)

Power BI needs a data source. Copy the structures below into an Excel file with separate sheets for each table.

### Table: DimProduct
| ProductID | ProductName | Category | UnitPrice | CostPrice | isHazardous | shelfLifeDays |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| P1 | Industrial Ethanol | Chemicals | 850 | 500 | TRUE | |
| P2 | Polyethylene Resin | Chemicals | 1200 | 750 | FALSE | |
| P3 | Laundry Detergent | FMCG | 15 | 8 | FALSE | 730 |
| P4 | Organic Milk 1L | FMCG | 4 | 2 | FALSE | 14 |

### Table: FactOrders (Sample)
| OrderID | Date | ProductID | CustomerID | Quantity | ShippedQty | Revenue | Status | RequestedDate | DeliveryDate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| O101 | 2026-04-01 | P1 | C1 | 100 | 100 | 85000 | Delivered | 2026-04-01 | 2026-04-03 |
| O102 | 2026-04-02 | P4 | C2 | 500 | 450 | 1800 | Delivered | 2026-04-02 | 2026-04-03 |

---

## Phase 2: Build in Power BI Desktop

1.  **Get Data**: Open Power BI Desktop > `Get Data` > `Excel Workbook` > Select your file.
2.  **Transform Data**: In Power Query, ensure `Date` columns are set to **Date** type and `Revenue/Cost` are **Fixed Decimal Number**.
3.  **Model Data**: 
    *   Go to the **Model View** (left sidebar).
    *   Drag `ProductID` from `DimProduct` to `FactOrders`.
    *   Create a `DimDate` table using the DAX script provided in the `POWER_BI_GUIDE.md`.
4.  **Create Measures**: Right-click any table > `New Measure`. Paste the DAX formulas (OTIF%, Inventory Turnover, etc.) from the guide.
5.  **Design Visuals**: Use the **Wireframe** in the guide to place your charts.

---

## Phase 3: Publish to Power BI Service (Cloud)

1.  **Save**: Save your file as `SupplyChain_Pro_Dashboard.pbix`.
2.  **Sign In**: Click **Sign In** at the top right of Power BI Desktop using your Work or School account.
3.  **Publish**:
    *   Click the **Publish** button on the `Home` ribbon.
    *   Select **My Workspace** (or a specific team workspace).
    *   Wait for the "Success!" message.
4.  **Open in Browser**: Click the link provided in the success dialog to open the report in the Power BI Service.

---

## Phase 4: Share and Embed

Once the report is in the browser (Power BI Service):

### Option A: Share with Colleagues
*   Click the **Share** button at the top.
*   Enter email addresses. Note: They will need a Power BI Pro license to view it.

### Option B: Publish to Web (Public Link)
*   *Warning: This makes data public.*
*   Go to `File` > `Embed report` > `Publish to web (public)`.
*   Copy the generated URL. You can now send this link to anyone.

### Option C: Embed in a Website/App
*   Go to `File` > `Embed report` > `Website or portal`.
*   Copy the `<iframe>` code. You can paste this into the `App.tsx` of this React app if you want to replace the mock UI with the real Power BI dashboard!

---

## Pro Tip: Automatic Data Refresh
If your Excel file is stored on **OneDrive** or **SharePoint**:
1.  In Power BI Service, go to the **Dataset** settings.
2.  Configure **Scheduled Refresh**.
3.  Power BI will now automatically update your dashboard whenever you update the Excel file!
