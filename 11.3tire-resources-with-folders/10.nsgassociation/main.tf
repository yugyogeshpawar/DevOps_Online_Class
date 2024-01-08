data "azurerm_network_interface" "existing_nic" {
  name                   = "todo-nic"
  resource_group_name    = var.resource_group_name
}

data "azurerm_network_security_group" "existing_nsg" {

  name                   = "acceptanceTestSecurityGroup1"
  resource_group_name    = var.resource_group_name
}

resource "azurerm_network_interface_security_group_association" "association" {

  network_interface_id      = data.azurerm_network_interface.existing_nic.id
  network_security_group_id = data.azurerm_network_security_group.existing_nsg.id
}


data "azurerm_network_interface" "existing_nic2" {
  name                   = "todo-backend-nic"
  resource_group_name    = var.resource_group_name
}

data "azurerm_network_security_group" "existing_nsg2" {

  name                   = "acceptanceTestSecurityGroup2"
  resource_group_name    = var.resource_group_name
}

resource "azurerm_network_interface_security_group_association" "association2" {

  network_interface_id      = data.azurerm_network_interface.existing_nic2.id
  network_security_group_id = data.azurerm_network_security_group.existing_nsg2.id
}
