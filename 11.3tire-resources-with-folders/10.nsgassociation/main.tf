resource "azurerm_network_interface_security_group_association" "association" {
  for_each                  = var.nsgassociation
  network_interface_id      = each.value.nic
  network_security_group_id = each.value.nsgid
}
