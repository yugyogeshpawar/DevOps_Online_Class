
resource "azurerm_subnet_network_security_group_association" "association-nsg-subnet" {
  for_each = var.subnets
  subnet_id                 = azurerm_subnet.subnet-block[each.key].id
  network_security_group_id = data.azurerm_network_security_group.existing-nsg[each.key].id
}
