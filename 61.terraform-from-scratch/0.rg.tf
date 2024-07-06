resource "azurerm_resource_group" "rgs-block" {
  for_each = var.rgs
  name     = each.value.rgname
  location = each.value.location
}