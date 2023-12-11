
resource "azurerm_resource_group" "yogesh_testing_rg" {
  for_each = var.resource_groups

  name     = each.key
  location = each.value.location
}

