resource "azurerm_resource_group" "yogeshrgblock" {
  for_each = var.rgs
  name     = each.value.rgname
  location = each.value.location
}
