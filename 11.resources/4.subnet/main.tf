resource "azurerm_subnet" "yogeshsubnet" {
  name                 = "AzureBastionSubnet"
  resource_group_name  = "rg1"
  virtual_network_name = "vn1-tf"
  address_prefixes     = ["10.0.2.0/24"]
}
