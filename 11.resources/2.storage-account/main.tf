resource "azurerm_storage_account" "yogeshstorageaccount" {
  name                     = "yogeshstorageaccounttf"
  resource_group_name      = "yogesh-rg-tf"
  location                 = "West Europe"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "example" {
  name                  = "tfstatefile"
  storage_account_name  = azurerm_storage_account.yogeshstorageaccount.name
  container_access_type = "private"
}