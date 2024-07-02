resource "azurerm_resource_group" "rgs-block" {
  for_each = var.rgs
  name     = each.value.rgname
  location = each.value.location
}


resource "azurerm_network_security_group" "example" {
  for_each            = var.nsgs
  name                = each.value.name
  location            = each.value.location
  resource_group_name = each.value.resource_group_name
  depends_on          = [azurerm_resource_group.rgs-block]
}


resource "azurerm_virtual_network" "vnets" {
  for_each            = var.vnets
  name                = each.value.name
  location            = each.value.location
  address_space       = each.value.address_space
  resource_group_name = each.value.resource_group_name
  depends_on          = [azurerm_resource_group.rgs-block]
}

resource "azurerm_subnet" "subnet-block" {
  for_each             = var.subnets
  name                 = each.value.subnetname
  address_prefixes     = each.value.address_prefixes
  virtual_network_name = each.value.vnetname
  resource_group_name  = each.value.resource_group_name
  depends_on           = [azurerm_virtual_network.vnets]
}



