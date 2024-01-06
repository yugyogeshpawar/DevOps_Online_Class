resource "azurerm_network_interface" "example" {
  name                = "todo-nic"
  location            = "West US"
  resource_group_name = "yugtodoapprg"

  ip_configuration {
    name                          = "internal"
    subnet_id                     = "/subscriptions/1d7ad62d-b735-4870-a659-a63196825b3b/resourceGroups/yugtodoapprg/providers/Microsoft.Network/virtualNetworks/todo-vn/subnets/subnet1"
    private_ip_address_allocation = "Dynamic"
  }
}


resource "azurerm_network_interface" "example2" {
  name                = "todo-backend-nic"
  location            = "West US"
  resource_group_name = "yugtodoapprg"

  ip_configuration {
    name                          = "internal"
    subnet_id                     = "/subscriptions/1d7ad62d-b735-4870-a659-a63196825b3b/resourceGroups/yugtodoapprg/providers/Microsoft.Network/virtualNetworks/todo-vn/subnets/subnet1"
    private_ip_address_allocation = "Dynamic"
  }
}
