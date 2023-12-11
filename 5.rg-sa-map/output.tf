output "resource_groups" {
  value = { for rg in azurerm_resource_group.yogesh_testing_rg : rg.name => {
    id       = rg.id
    name     = rg.name
    location = rg.location
  } }
}
