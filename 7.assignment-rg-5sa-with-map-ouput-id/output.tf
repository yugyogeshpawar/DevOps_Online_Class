output "tgs_ids" {
  value = [for rg in azurerm_storage_account.assingment_account : rg.id]
}
