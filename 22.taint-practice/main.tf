resource "azurerm_resource_group" "example" {
  name     = "yug-resources22"
  location = "South Central US"
}

resource "azurerm_virtual_network" "example" {
  name                = "yug-network23"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
}