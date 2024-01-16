
data "azurerm_network_interface" "existing_nic" {
  for_each            = var.azlbassociation
  name                = each.value.nicname
  resource_group_name = each.value.rgname
}


data "azurerm_lb" "existing_lb" {
  for_each            = var.azlbassociation
  name                = each.value.lbname
  resource_group_name = each.value.rgname
}

data "azurerm_lb_backend_address_pool" "azlbbackend" {
  for_each        = var.azlbassociation
  name            = each.value.lbbackendname
  loadbalancer_id = data.azurerm_lb.existing_lb[each.key].id
}

resource "azurerm_network_interface_backend_address_pool_association" "azlbassociation" {
  for_each                = var.azlbassociation
  network_interface_id    = data.azurerm_network_interface.existing_nic[each.key].id
  ip_configuration_name   = "ipconfig1"
  backend_address_pool_id = data.azurerm_lb_backend_address_pool.azlbbackend[each.key].id
}
