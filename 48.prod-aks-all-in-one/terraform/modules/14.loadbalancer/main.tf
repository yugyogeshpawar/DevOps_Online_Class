resource "azurerm_public_ip" "lb_public_ip" {
  for_each            = var.lbs
  name                = each.value.ipname
  location            = each.value.location
  resource_group_name = each.value.rgname
  allocation_method   = "Static"
  sku                 = "Standard"
}



resource "azurerm_lb" "azlbblock" {
  for_each            = var.lbs
  name                = each.value.lbname
  resource_group_name = each.value.rgname
  location            = each.value.location
  sku                 = "Standard"

  frontend_ip_configuration {
    name                 = each.value.ipname
    public_ip_address_id = azurerm_public_ip.lb_public_ip[each.key].id
  }
}

resource "azurerm_lb_probe" "azlbprob" {
  for_each        = var.lbs
  name            = each.value.lbprobname
  loadbalancer_id = azurerm_lb.azlbblock[each.key].id
  protocol        = "Http"
  port            = 80
  request_path    = "/"
}


resource "azurerm_lb_backend_address_pool" "azlbbackend" {
  for_each        = var.lbs
  name            = each.value.lbbackendname
  loadbalancer_id = azurerm_lb.azlbblock[each.key].id
}



resource "azurerm_lb_rule" "azlbrule" {
  for_each                       = var.lbs
  loadbalancer_id                = azurerm_lb.azlbblock[each.key].id
  name                           = each.value.lbrulename
  protocol                       = "Tcp"
  frontend_port                  = 80
  backend_port                   = 80
  frontend_ip_configuration_name = each.value.ipname
  backend_address_pool_ids       = [azurerm_lb_backend_address_pool.azlbbackend[each.key].id]
  probe_id                       = azurerm_lb_probe.azlbprob[each.key].id
}



