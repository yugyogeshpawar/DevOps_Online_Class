resource "azurerm_public_ip" "todopublicip" {
  name                = "public-todo"
  location            =  "South Central US"
  resource_group_name = "yugtodoapprg"
  allocation_method   = "Static"
  sku                 = "Standard"
}

