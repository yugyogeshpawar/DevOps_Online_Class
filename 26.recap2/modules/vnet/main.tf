
data "azurerm_resource_group" "existing_rg" {
  for_each = var.vents
  name     = each.value.rgname
}


resource "azurerm_virtual_network" "vnets_block" {
  for_each            = var.vents
  name                = each.value.vnetname
  location            = data.azurerm_resource_group.existing_rg[each.key].location
  resource_group_name = data.azurerm_resource_group.existing_rg[each.key].name
  address_space       = each.value.address_space

  dynamic "subnet" {
    for_each = var.subnets 
    content {
      name           = subnet.value.name
      address_prefix = subnet.value.address_prefix
    }
  }
}
