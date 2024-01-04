resource "azurerm_mssql_server" "sqlserver" {
  name                         = "yugsqlserver"
  resource_group_name          = "yogesh-rg-tf"
  location                     = "West Europe"
  version                      = "12.0"
  administrator_login          = "adminuser"
  administrator_login_password = "admin@123456"
}