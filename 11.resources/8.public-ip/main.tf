resource "azurerm_public_ip" "todo-public-ip" {
  name                = "public-todo-front"
  location            = "West US"
  resource_group_name = "rg1"
  allocation_method   = "Static"
  sku                 = "Standard"
}
