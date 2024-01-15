

resource "azurerm_network_interface_backend_address_pool_association" "example" {
  network_interface_id       = ""
  ip_configuration_name      = "public" 
  backend_address_pool_id     = azurerm_lb_backend_address_pool.example.id
}
