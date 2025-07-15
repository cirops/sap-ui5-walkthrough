sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  (Controller, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
      onInit() {
        const oViewModel = new JSONModel({
          currency: "EUR",
        });
        this.getView().setModel(oViewModel, "view");
      },

      onFilterInvoices(oEvent) {
        // build filter array
        const aFilter = [];
        const sQuery = oEvent.getParameter("query");
        if (sQuery) {
          // Try parsing the query to number for Quantity filter
          const iQuantity = parseInt(sQuery, 10);

          const aOrFilters = [];

          // Filter by ProductName (string match)
          aOrFilters.push(
            new Filter("ProductName", FilterOperator.Contains, sQuery)
          );

          // Filter by Quantity (if it's a valid number)
          if (!isNaN(iQuantity)) {
            aOrFilters.push(
              new Filter("Quantity", FilterOperator.GE, iQuantity)
            );
          }

          // Combine with OR logic
          aFilter.push(
            new Filter({
              filters: aOrFilters,
              and: false, // OR condition
            })
          );
        }

        // filter binding
        const oList = this.byId("invoiceList");
        const oBinding = oList.getBinding("items");
        oBinding.filter(aFilter);
      },

      onPress(oEvent) {
        const oItem = oEvent.getSource();
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("detail", {
          invoicePath: window.encodeURIComponent(
            oItem.getBindingContext("invoice").getPath().substring(1)
          ),
        });
      },
    });
  }
);
