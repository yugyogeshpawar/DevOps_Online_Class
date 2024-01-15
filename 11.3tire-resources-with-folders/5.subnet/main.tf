resource "azurerm_subnet" "yogeshsubnet" {
  for_each             = var.subnets
  name                 = each.key
  resource_group_name  = each.value.rgname
  virtual_network_name = each.value.vnet
  address_prefixes     = each.value.address_prefixes
}

