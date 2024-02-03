resource "azurerm_virtual_network" "example" {
  for_each = var.vnets
  name                = each.value.vnetname
  location            = each.value.location
  resource_group_name = each.value.rgname
  address_space       = each.value.address_space

  tags = var.tags
}