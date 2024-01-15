data "azurerm_virtual_network" "existing_vnet" {
  name                = "todo-vn"
  resource_group_name = "yugtodoapprg"
}

data "azurerm_subnet" "existing_subnet" {
  name                 = "AzureBastionSubnet"
  virtual_network_name = data.azurerm_virtual_network.existing_vnet.name
  resource_group_name  = data.azurerm_virtual_network.existing_vnet.resource_group_name
}

data "azurerm_public_ip" "existing_public_ip" {
  name                = "public-todo"
  resource_group_name = "yugtodoapprg"
}

resource "azurerm_bastion_host" "yogeshbastion" {
  name                = "yugtodobastion"
  location            = "East Us"
  resource_group_name = "yugtodoapprg"

  ip_configuration {
    name                 = "configuration"
    subnet_id            = data.azurerm_subnet.existing_subnet.id
    public_ip_address_id = data.azurerm_public_ip.existing_public_ip.id
  }
}
