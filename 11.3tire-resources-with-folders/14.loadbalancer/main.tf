resource "azurerm_public_ip" "lb_public_ip" {
  name                = "lb-public-ip"
  location            = "South Central US"
  resource_group_name = "yugtodoapprg"
  allocation_method   = "Static"
}

resource "azurerm_lb" "example" {
  name                = "todo-lb"
  resource_group_name = "yugtodoapprg"
  location            = "South Central US"

  frontend_ip_configuration {
    name                 = "PublicIPAddress"
    public_ip_address_id = azurerm_public_ip.lb_public_ip.id
  }
}

resource "azurerm_lb_probe" "example" {
  name            = "http-probe"
  loadbalancer_id = azurerm_lb.example.id
  protocol        = "Http"
  port            = 80
  request_path    = "/"
}

resource "azurerm_lb_rule" "example" {
  loadbalancer_id                = azurerm_lb.example.id
  name                           = "RDPRule"
  protocol                       = "Tcp"
  frontend_port                  = 80
  backend_port                   = 80
  frontend_ip_configuration_name = "PublicIPAddress"
}


resource "azurerm_lb_backend_address_pool" "example" {
  name                           = "backend-pool"
  loadbalancer_id                = azurerm_lb.example.id
}

resource "azurerm_network_interface_backend_address_pool_association" "example" {
  network_interface_id       = "/subscriptions/327e6c1f-091f-4e21-95dd-76d5c48476a3/resourceGroups/yugtodoapprg/providers/Microsoft.Network/networkInterfaces/todo-nic"
  ip_configuration_name      = "internal" 
  backend_address_pool_id     = azurerm_lb_backend_address_pool.example.id
}
