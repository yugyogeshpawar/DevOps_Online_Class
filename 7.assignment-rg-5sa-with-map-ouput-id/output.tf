output "tgs_ids" {
  value = [for rg in azurerm_storage_account.s13dec : rg.id]
}
