
data "azurerm_virtual_network" "existing_vnet" {
  name                = "todo-vn"
  resource_group_name = "yugtodoapprg"
}

data "azurerm_subnet" "existing_subnet" {
  name                 = "AzureBastionSubnet"
  virtual_network_name = data.azurerm_virtual_network.existing_vnet.name
  resource_group_name  = data.azurerm_virtual_network.existing_vnet.resource_group_name
}

resource "azurerm_bastion_host" "yogeshbastion" {
  name                = "yugtodobastion"
  location            = "West US"
  resource_group_name = "yugtodoapprg"

  ip_configuration {
    name                 = "configuration"
    subnet_id            = data.azurerm_subnet.existing_subnet.id
    public_ip_address_id = "/subscriptions/1d7ad62d-b735-4870-a659-a63196825b3b/resourceGroups/yugtodoapprg/providers/Microsoft.Network/publicIPAddresses/public-todo"
  }
}



