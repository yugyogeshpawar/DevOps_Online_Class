
resource "azurerm_storage_container" "example" {
  name                  = "tfstatefile"
  storage_account_name  = "yogeshstorageaccounttf"
  container_access_type = "private"
}
