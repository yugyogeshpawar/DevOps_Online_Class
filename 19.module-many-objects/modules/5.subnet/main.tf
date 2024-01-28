

resource "azurerm_subnet" "subnet" {
  for_each             = var.subnets
  name                 = each.value.subnetname
  resource_group_name  = each.value.rgname
  virtual_network_name = each.value.vnetname
  address_prefixes     = each.value.address_prefixes_subnet
}


output "subnets" {
  value = azurerm_subnet.subnet
}