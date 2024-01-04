# resource "azurerm_subnet" "yogeshsubnet" {
#   name                 = "AzureBastionSubnet"
#   resource_group_name  = "todoapprg"
#   virtual_network_name = "todo-vn"
#   address_prefixes     = ["10.0.2.0/24"]
# }


resource "azurerm_subnet" "yogeshsubnet" {
  name                 = "internal"
  resource_group_name  = "todoapprg"
  virtual_network_name = "todo-vn"
  address_prefixes     = ["10.0.2.0/24"]
}
