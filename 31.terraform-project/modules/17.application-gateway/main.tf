
data "azurerm_public_ip" "existing_public_ip" {
  for_each            = var.appgateways
  name                = each.value.ipname
  resource_group_name = each.value.rgname
}

data "azurerm_subnet" "existing_subnet" {
  for_each             = var.appgateways
  name                 = each.value.subnetname
  virtual_network_name = each.value.vnetname
  resource_group_name  = each.value.rgname
}



resource "azurerm_application_gateway" "network" {

  for_each            = var.appgateways
  name                = each.value.appgatewayname
  resource_group_name = each.value.rgname
  location            = each.value.location

  sku {
    name     = each.value.skuname
    tier     = each.value.skutier
    capacity = each.value.capacity
  }

  gateway_ip_configuration {
    name      = "${each.value.appgatewayname}-gwipcfg"
    subnet_id = data.azurerm_subnet.existing_subnet[each.key].id
  }

  # dynamic "frontend_port" {
  #   for_each = var.appgateways
  #   content {
  #     name = frontend_ports.key
  #     port = frontend_ports.value
  #   }
  # }


  frontend_port {
    name = "${each.value.appgatewayname}-feport"
    port = 80
  }

  frontend_ip_configuration {
    name                 = "${each.value.appgatewayname}-feip"
    public_ip_address_id = data.azurerm_public_ip.existing_public_ip[each.key].id
  }

  backend_address_pool {
    name = "${each.value.appgatewayname}-beap"
  }

  backend_http_settings {
    name                  = "${each.value.appgatewayname}-be-htst"
    cookie_based_affinity = "Disabled"
    path                  = "/"
    port                  = 80
    protocol              = "Http"
    request_timeout       = 60
  }

  http_listener {
    name                           = "${each.value.appgatewayname}-httplstn"
    frontend_ip_configuration_name = "${each.value.appgatewayname}-feip"
    frontend_port_name             = "${each.value.appgatewayname}-feport"
    protocol                       = "Http"
  }

  request_routing_rule {
    name                       = "${each.value.appgatewayname}-rqrt"
    priority                   = 9
    rule_type                  = "Basic"
    http_listener_name         = "${each.value.appgatewayname}-httplstn"
    backend_address_pool_name  = "${each.value.appgatewayname}-beap"
    backend_http_settings_name = "${each.value.appgatewayname}-be-htst"
  }
}
