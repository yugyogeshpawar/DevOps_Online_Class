resource "azurerm_virtual_network" "vnet-tf" {
  for_each = var.vns
  name                = each.value.name
  address_space       = each.value.addresspace
  location            = each.value.location
  resource_group_name = each.value.rgname
}