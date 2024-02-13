data "azurerm_resource_group" "example" {
  name = "Amar-RG01"
}

data "azurerm_web_application_firewall_policy" "example" {
  resource_group_name = "Amar-RG01"
  name                = "applicationwaf01"
}


data "azurerm_subnet" "example" {
  name                 = "subnet2"
  resource_group_name  = "Amar-RG01"
  virtual_network_name = "vnet01"
}


data "azurerm_public_ip" "example" {
  name                = "LBIP"
  resource_group_name = data.azurerm_resource_group.example.name
}



resource "azurerm_application_gateway" "network" {
  name                = "example-appgateway"
  resource_group_name = data.azurerm_resource_group.example.name
  location            = data.azurerm_resource_group.example.location

  sku {
    name     = "WAF_v2"
    tier     = "WAF_v2"
    capacity = 2
  }

  firewall_policy_id = data.azurerm_web_application_firewall_policy.example.id


  gateway_ip_configuration {
    name      = "my-gateway-ip-configuration"
    subnet_id = data.azurerm_subnet.example.id
  }

  frontend_port {
    name = "example-frontend-port"
    port = 80
  }

  frontend_ip_configuration {
    name                 = "my-frontend-ip"
    public_ip_address_id = data.azurerm_public_ip.example.id
  }

  backend_address_pool {
    name = "my-backend-pool"
  }

  backend_http_settings {
    name                  = "example-http-settings"
    cookie_based_affinity = "Disabled"
    path                  = "/path1/"
    port                  = 80
    protocol              = "Http"
    request_timeout       = 60
  }

  http_listener {
    name                           = "example-http-listener"
    frontend_ip_configuration_name = "my-frontend-ip"
    frontend_port_name             = "example-frontend-port"
    protocol                       = "Http"
  }



  request_routing_rule {
    name                       = "example-request-routing-rule"
    priority                   = 9
    rule_type                  = "Basic"
    http_listener_name         = "example-http-listener"
    backend_address_pool_name  = "my-backend-pool"
    backend_http_settings_name = "example-http-settings"
  }
}
