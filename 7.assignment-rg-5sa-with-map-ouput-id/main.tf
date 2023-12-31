resource "azurerm_resource_group" "assingment_resource" {
  name = "azure_assignment"
  location = "eastus"
}

resource "azurerm_storage_account" "s13dec" {
  for_each = var.storage_accounts_names

  name                     = each.key
  resource_group_name      = azurerm_resource_group.assingment_resource.name
  location                 = each.value.location
  account_tier             = "Standard"
  account_replication_type = "GRS"

  tags = {
    environment = "staging"
  }

}
