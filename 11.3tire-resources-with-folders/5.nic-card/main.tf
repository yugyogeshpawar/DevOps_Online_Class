resource "azurerm_network_interface" "example" {
  name                = "yogesh-tf-nic"
  location            = "West Europe"
  resource_group_name = "yogesh-rg-tf"

  ip_configuration {
    name                          = "internal"
    subnet_id                     = "/subscriptions/1d7ad62d-b735-4870-a659-a63196825b3b/resourceGroups/yogesh-rg-tf/providers/Microsoft.Network/virtualNetworks/yogesh-tf-network/subnets/internal"
    private_ip_address_allocation = "Dynamic"
  }
}
