resource "azurerm_subnet" "subnet" {
  for_each             = var.rgs
  name                 = each.value.subnetname
  resource_group_name  = each.value.rgname
  virtual_network_name = each.value.vnetname
  address_prefixes     = each.value.address_prefixes_subnet
}

output "subnet_id" {
  value = azurerm_subnet.subnet[*].id
}
