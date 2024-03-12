resource "azurerm_virtual_network" "vnet-tf" {
  for_each            = var.vnets
  name                = each.value.vnetname
  address_space       = each.value.vnaddresspace
  location            = each.value.location != null ? each.value.location : lookup(var.locations, each.value.rgname, "eust us")
  resource_group_name = each.value.rgname
}