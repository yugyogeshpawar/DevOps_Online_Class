data "azurerm_network_interface" "existing_nic" {
  for_each            = var.appgatewaysassociation
  name                = each.value.nicname
  resource_group_name = each.value.rgname
}

data "azurerm_application_gateway" "existing_appgateway" {
  for_each            = var.appgatewaysassociation
  name                = each.value.appgatewayname
  resource_group_name = each.value.rgname
}

resource "azurerm_network_interface_application_gateway_backend_address_pool_association" "example" {
  for_each                = var.appgatewaysassociation
  network_interface_id    = data.azurerm_network_interface.existing_nic[each.key].id
  ip_configuration_name   = each.value.ipconfigname
  backend_address_pool_id = data.azurerm_application_gateway.existing_appgateway[each.key].backend_address_pool.0.id
}