output "names_or_rg" {
  value = [for rg in azurerm_resource_group.resource_group_block : rg.name]
}