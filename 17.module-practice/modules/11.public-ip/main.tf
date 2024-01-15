resource "azurerm_public_ip" "todopublicip" {
  name                = "public-todo"
  location            = "East Us"
  resource_group_name = "yugtodoapprg"
  allocation_method   = "Static"
  sku                 = "Standard"
}

