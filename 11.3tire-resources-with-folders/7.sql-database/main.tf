resource "azurerm_sql_database" "example" {
  name                = "myexamplesqldatabase"
  resource_group_name = "todoapprg"
  location            = "East Us"
  server_name         = "yugsqlserver"

  tags = {
    environment = "staging"
  }

  lifecycle {
    prevent_destroy = false
  }
}