data "azurerm_subnet" "existing-subnet" {
  for_each             = var.nics
  name                 = each.value.subnetname
  virtual_network_name = each.value.vnetname
  resource_group_name  = each.value.resource_group_name
  depends_on           = [azurerm_virtual_network.vnets]
}



data "azurerm_public_ip" "existing-pubip" {
  for_each            = var.nics
  name                = each.value.pubipname
  resource_group_name = each.value.resource_group_name
  depends_on          = [azurerm_resource_group.rgs-block]
}


resource "azurerm_network_interface" "nic-block" {
  for_each            = var.nics
  name                = each.value.name
  location            = each.value.location
  resource_group_name = each.value.resource_group_name
  ip_configuration {
    name      = each.value.ip_conf_name
    subnet_id = data.azurerm_subnet.existing-subnet[each.key].id
    # subnet_id                     = each.value.subnetid
    private_ip_address_allocation = each.value.private_ip_address_allocation
    public_ip_address_id          = data.azurerm_public_ip.existing-pubip[each.key].id
  }
}