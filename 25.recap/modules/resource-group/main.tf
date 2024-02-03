resource "azurerm_resource_group" "cpblock" {
  for_each = var.rgs
  name     = each.value.rgname
  location = each.value.location
  tags = var.tags
}