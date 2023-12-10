
resource "azurerm_resource_group" "yogesh_testing_rg" {
  for_each = toset(var.resource_group_names)
  name     = each.value
  location = var.location
}

resource "azurerm_storage_account" "yogesh_testing_sa" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.yogesh_testing_rg.name
  location                 = azurerm_resource_group.yogesh_testing_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}
