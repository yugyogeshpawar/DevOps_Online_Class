
output "resource_group_name" {
  value = azurerm_resource_group.yogesh_testing_rg.name
}

output "storage_account_name" {
  value = azurerm_storage_account.yogesh_testing_sa.name
}

output "location" {
  value = azurerm_resource_group.yogesh_testing_rg.location
}
