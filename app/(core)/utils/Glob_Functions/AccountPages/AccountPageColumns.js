import { Checkbox } from "@mui/material";

//Quote
export const headCells_Quotation = [
    {
        id: 'SrNo',
        numeric: true,
        disablePadding: false,
        label: 'Sr#',
        align: "center",
        sortable:false
    },
    {
        id: 'Date',
        numeric: false,
        disablePadding: false,
        label: 'Date',
        align: "center",
        sortable:true
    },
    {
        id: 'SKUNo',
        numeric: false,
        disablePadding: false,
        label: 'SKU#',
        align: "center",
        sortable:true
    },
    {
        id: 'TotalDesign',
        numeric: true,
        disablePadding: false,
        label: 'Total Design',
        align: "center",
        sortable:true
    },
    {
        id: 'Amount',
        numeric: true,
        disablePadding: false,
        label: 'Total Amount',
        align: "right",
        sortable:true
    },
    {
        id: 'Print',
        numeric: false,
        disablePadding: false,
        label: 'Print',
        align: "center",
        sortable:false
    },
];

//Jobs
export const headCells_Jobs = [
    { id: 'checkbox', label: <Checkbox />, minWidth: 50, align: "center" },
    { id: 'Sr#', label: 'Sr#', minWidth: 85, align: "center" },
    { id: 'Date', label: 'Date', minWidth: 130, align: "center" },
    { id: 'SKUNO', label: 'SKU#', minWidth: 110, align: "center" },
    { id: 'PO', label: 'PO', minWidth: 110, align: "center" },
    { id: 'JobNo', label: 'Job#', minWidth: 100, align: "center" },
    { id: 'DesignNo', label: 'Design#', minWidth: 100, align: "center" },
    { id: 'Category', label: 'Category', minWidth: 110, align: "center" },
    { id: 'PDate', label: 'Promise Date', minWidth: 130, align: "center" },
    { id: 'FinalAmount', label: 'Quote Price', minWidth: 150, align: "center" },
    { id: 'ProgressStatusName', label: 'Status', minWidth: 120, align: "center" },
    { id: 'Quantity', label: 'Total Qty', minWidth: 100, align: "center" },
    { id: 'SuppliedQuantity', label: 'Supplied', minWidth: 100, align: "center" },
];

//Sales
export const headCells_Sales = [
    {
        id: 'SrNo',
        numeric: true,
        disablePadding: false,
        label: 'Sr#',
        align: "center"
    },
    {
        id: 'Date',
        numeric: false,
        disablePadding: false,
        label: 'OutWard Date',
        align: "center"
    },
    {
        id: 'StockDocumentNo',
        numeric: false,
        disablePadding: false,
        label: 'Bill#',
        align: "center"
    },
    {
        id: 'Amount',
        numeric: true,
        disablePadding: false,
        label: 'Total Amount',
        align: "right"
    },
    {
        id: 'Print',
        numeric: true,
        disablePadding: false,
        label: 'Print',
        align: "center"
    },
];

//Sales Report
export const headCells_SalesReport = [
    {
      id: "SrNo",
      numeric: true,
      disablePadding: false,
      label: "Sr#",
      align: "center",
      minWidth: 100,
    },
    {
      id: "EntryDate",
      numeric: false,
      disablePadding: false,
      label: "In Date",
      align: "center",
      minWidth: 130,
    },
    {
      id: "StockDocumentNo",
      numeric: false,
      disablePadding: false,
      label: "Bill#",
      align: "center",
      minWidth: 185,
    },
    {
      id: "SKUNo",
      numeric: false,
      disablePadding: false,
      label: "SKU#",
      align: "center",
      minWidth: 110,
    },
    {
      id: "designno",
      numeric: false,
      disablePadding: false,
      label: "Design#",
      align: "center",
      minWidth: 110,
    },
    {
      id: "MetalType",
      numeric: false,
      disablePadding: false,
      label: "Metal Type",
      align: "center",
      minWidth: 110,
    },
    {
      id: "MetalAmount",
      numeric: false,
      disablePadding: false,
      label: "MetalAmount",
      align: "center",
      minWidth: 110,
    },
    {
      id: "DiamondAmount",
      numeric: false,
      disablePadding: false,
      label: "DiamondAmount",
      align: "center",
      minWidth: 110,
    },
    {
      id: "ColorStoneAmount",
      numeric: false,
      disablePadding: false,
      label: "ColorStone Amount",
      align: "center",
      minWidth: 185,
    },
    {
      id: "LabourAmount",
      numeric: false,
      disablePadding: false,
      label: "Labour Amount",
      align: "center",
      minWidth: 160,
    },
    {
      id: "OtherAmount",
      numeric: false,
      disablePadding: false,
      label: "Other Amount",
      align: "center",
      minWidth: 160,
    },
    {
      id: "UnitCost",
      numeric: false,
      disablePadding: false,
      label: "Unit Cost",
      align: "center",
      minWidth: 140,
    },
    {
      id: "Category",
      numeric: false,
      disablePadding: false,
      label: "Category",
      align: "center",
      minWidth: 110,
    },
    {
      id: "GrossWt",
      numeric: false,
      disablePadding: false,
      label: "GrossWt",
      align: "center",
      minWidth: 110,
    },
    {
      id: "NetWt",
      numeric: false,
      disablePadding: false,
      label: "NetWt",
      align: "center",
      minWidth: 110,
    },
    {
      id: "DiaPcs",
      numeric: false,
      disablePadding: false,
      label: "Dia Pcs",
      align: "center",
      minWidth: 110,
    },
    {
      id: "DiaWt",
      numeric: false,
      disablePadding: false,
      label: "DiaWt",
      align: "center",
      minWidth: 110,
    },
    {
      id: "CsPcs",
      numeric: false,
      disablePadding: false,
      label: "CsPcs",
      align: "center",
      minWidth: 110,
    },
    {
      id: "CsWt",
      numeric: false,
      disablePadding: false,
      label: "CsWt",
      align: "center",
      minWidth: 110,
    },
];

//Memo Report
export const headCells = [
    {
      id: "SrNo",
      numeric: true,
      disablePadding: false,
      label: "Sr#",
      align: "center",
      minWidth: 100,
    },
    {
      id: "EntryDate",
      numeric: false,
      disablePadding: false,
      label: "In Date",
      align: "center",
      minWidth: 130,
    },
    {
      id: "StockDocumentNo",
      numeric: false,
      disablePadding: false,
      label: "Memo#",
      align: "center",
      minWidth: 185,
    },
    {
      id: "SKUNo",
      numeric: false,
      disablePadding: false,
      label: "SKU#",
      align: "center",
      minWidth: 110,
    },
    {
      id: "designno",
      numeric: false,
      disablePadding: false,
      label: "Design#",
      align: "center",
      minWidth: 110,
    },
    {
      id: "MetalType",
      numeric: false,
      disablePadding: false,
      label: "Metal Type",
      align: "center",
      minWidth: 110,
    },
    {
      id: "Category",
      numeric: false,
      disablePadding: false,
      label: "Category",
      align: "center",
      minWidth: 110,
    },
    {
      id: "GrossWt",
      numeric: false,
      disablePadding: false,
      label: "GrossWt",
      align: "center",
      minWidth: 110,
    },
    {
      id: "NetWt",
      numeric: false,
      disablePadding: false,
      label: "NetWt",
      align: "center",
      minWidth: 110,
    },
    {
      id: "DiaPcs",
      numeric: false,
      disablePadding: false,
      label: "Dia Pcs",
      align: "center",
      minWidth: 110,
    },
    {
      id: "DiaWt",
      numeric: false,
      disablePadding: false,
      label: "DiaWt",
      align: "center",
      minWidth: 110,
    },
    {
      id: "CsPcs",
      numeric: false,
      disablePadding: false,
      label: "CsPcs",
      align: "center",
      minWidth: 110,
    },
    {
      id: "CsWt",
      numeric: false,
      disablePadding: false,
      label: "CsWt",
      align: "center",
      minWidth: 110,
    },
];