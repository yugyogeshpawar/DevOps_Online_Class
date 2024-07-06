resource "azurerm_virtual_network" "vnets" {
  for_each            = var.vnets
  name                = each.value.name
  location            = each.value.location
  address_space       = each.value.address_space
  resource_group_name = each.value.resource_group_name
  depends_on          = [azurerm_resource_group.rgs-block]
}