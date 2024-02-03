
data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "example" {
  for_each                    = var.keyvault
  name                        = each.value.keyvaultname
  location                    = each.value.location
  resource_group_name         = each.value.rgname
  enabled_for_disk_encryption = false
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false

  sku_name = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id
    secret_permissions = [
      "Get",
      "Set",
      "List"
    ]
  }
}
