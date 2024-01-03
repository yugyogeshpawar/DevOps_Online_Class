resource "azurerm_resource_group" "yogeshrgblock" {
  for_each = var.rgs
  name     = each.key
  location = each.value
}
