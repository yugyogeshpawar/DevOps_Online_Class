
data "azurerm_network_interface" "existing_nic" {
  for_each            = var.nsgassociation
  name                = each.value.nicname
  resource_group_name = each.value.rgname
}

data "azurerm_network_security_group" "existing_nsg" {
  for_each            = var.nsgassociation
  name                = each.value.nsgname
  resource_group_name = each.value.rgname
}

resource "azurerm_network_interface_security_group_association" "association2" {
  for_each = var.nsgassociation

  network_interface_id      = data.azurerm_network_interface.existing_nic[each.key].id
  network_security_group_id = data.azurerm_network_security_group.existing_nsg[each.key].id
}
