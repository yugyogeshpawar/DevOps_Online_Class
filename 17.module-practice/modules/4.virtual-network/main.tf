resource "azurerm_virtual_network" "vnet-tf" {
  for_each            = var.rgs
  name                = each.value.vnetname
  address_space       = each.value.vnaddresspace
  location            = each.value.location
  resource_group_name = each.value.rgname
}
