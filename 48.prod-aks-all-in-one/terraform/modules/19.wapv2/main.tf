data "azurerm_resource_group" "example" {
  for_each = var.appgateways
  name     = each.value.rgname
}


data "azurerm_subnet" "example" {
  for_each             = var.appgateways
  name                 = each.value.subnetname
  resource_group_name  = each.value.rgname
  virtual_network_name = each.value.vnetname
}


data "azurerm_public_ip" "example" {
  for_each            = var.appgateways
  name                = each.value.ipname
  resource_group_name = each.value.rgname
}


data "azurerm_web_application_firewall_policy" "example" {
  for_each            = var.appgateways
  resource_group_name = data.azurerm_resource_group.example[each.key].name
  name                = each.value.wafpolicy
}

resource "azurerm_application_gateway" "network" {
  for_each            = var.appgateways
  name                = each.value.appgatewayname
  resource_group_name = data.azurerm_resource_group.example[each.key].name
  location            = data.azurerm_resource_group.example[each.key].location

  sku {
    name     = "WAF_v2"
    tier     = "WAF_v2"
    capacity = 2
  }

  firewall_policy_id = data.azurerm_web_application_firewall_policy.example[each.key].id


  gateway_ip_configuration {
    name      = "${each.value.appgatewayname}-gwipcfg"
    subnet_id = data.azurerm_subnet.example[each.key].id
  }

  frontend_port {
    name = "${each.value.appgatewayname}-feport"
    port = 80
  }

  frontend_ip_configuration {
    name                 = "${each.value.appgatewayname}-feip"
    public_ip_address_id = data.azurerm_public_ip.example[each.key].id
  }

  backend_address_pool {
    name = "my-backend-pool"
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
