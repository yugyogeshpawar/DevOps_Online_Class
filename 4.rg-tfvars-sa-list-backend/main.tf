# main.tf

resource "azurerm_resource_group" "yogesh_testing_rg" {
  for_each = toset(var.resource_group_names)
  name     = each.value
  location = "West Europe"
}

resource "azurerm_storage_account" "yogesh_testing_sa" {
  for_each = azurerm_resource_group.yogesh_testing_rg

  name                     = "${replace(each.value.name, "_", "")}storageacount"
  resource_group_name      = each.value.name
  location                 = "West Europe"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}
