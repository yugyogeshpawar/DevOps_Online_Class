resource "azurerm_resource_group" "yogesh-rg" {
    name     = "yogesh-rg"
    location = "West Europe"
}

resource "azurerm_virtual_network" "yogesh-vn" {
    name                = "yogesh-vn12"
    address_space       = ["89.0.142.86/16"]
    location            = azurerm_resource_group.yogesh-rg.location
    resource_group_name = azurerm_resource_group.yogesh-rg.name
}



#resource "azurerm_virtual_network" "yogesh-vn" {
#    name                = "yogesh-vn12"
#   address_space       = ["89.0.142.86/16"]
#    location            = azurerm_resource_group.yogesh-rg.location
#    resource_group_name = azurerm_resource_group.yogesh-rg.name
#}
