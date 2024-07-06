resource "azurerm_subnet" "subnet-block" {
  for_each             = var.subnets
  name                 = each.value.subnetname
  address_prefixes     = each.value.address_prefixes
  virtual_network_name = each.value.vnetname
  resource_group_name  = each.value.resource_group_name

  depends_on           = [azurerm_virtual_network.vnets]
}

data "azurerm_network_security_group" "existing-nsg" {
  for_each = var.subnets
  name     = each.value.nsgname
  resource_group_name = each.value.resource_group_name
  depends_on = [azurerm_network_security_group.example]
}