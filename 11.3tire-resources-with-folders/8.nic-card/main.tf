data "azurerm_subnet" "existing_subnet" {
  name                 = "subnet1"
  virtual_network_name = "todo-vn"
  resource_group_name  = "yugtodoapprg"
}

resource "azurerm_network_interface" "example" {
  name                = "todo-nic"
  location            = "South Central US"
  resource_group_name = "yugtodoapprg"

  ip_configuration {
    name                          = "internal"
    subnet_id                     = data.azurerm_subnet.existing_subnet.id
    private_ip_address_allocation = "Dynamic"
  }
}


resource "azurerm_network_interface" "example3" {
  name                = "front-todo-nic"
  location            = "South Central US"
  resource_group_name = "yugtodoapprg"

  ip_configuration {
    name                          = "internal"
    subnet_id                     = data.azurerm_subnet.existing_subnet.id
    private_ip_address_allocation = "Dynamic"
  }
}



resource "azurerm_network_interface" "example2" {
  name                = "todo-backend-nic"
  location            = "South Central US"
  resource_group_name = "yugtodoapprg"

  ip_configuration {
    name                          = "internal"
    subnet_id                     = data.azurerm_subnet.existing_subnet.id
    private_ip_address_allocation = "Dynamic"
  }
}
