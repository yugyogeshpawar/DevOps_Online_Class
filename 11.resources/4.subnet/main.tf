resource "azurerm_subnet" "yogeshsubnet" {
  name                 = "internal"
  resource_group_name  = "yogesh-rg-tf"
  virtual_network_name = "yogesh-tf-network"
  address_prefixes     = ["10.0.2.0/24"]
}
