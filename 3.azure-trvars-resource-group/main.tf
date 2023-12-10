resource "azurerm_resource_group" "resource_group_yogesh" {
  for_each = toset(var.azurerm_resource_group_names)
  name     = each.value
  location = "West Europe"
}
