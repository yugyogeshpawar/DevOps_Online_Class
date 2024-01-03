resource "azurerm_bastion_host" "yogeshbastion" {
  name                = "examplebastion"
  location            = "West US"
  resource_group_name = "rg1"

  ip_configuration {
    name                 = "configuration"
    subnet_id            = "/subscriptions/1d7ad62d-b735-4870-a659-a63196825b3b/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vn1-tf/subnets/AzureBastionSubnet"
    public_ip_address_id = "/subscriptions/1d7ad62d-b735-4870-a659-a63196825b3b/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/public-todo-front"
  }
}