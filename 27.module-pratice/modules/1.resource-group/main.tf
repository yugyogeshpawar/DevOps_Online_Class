resource "azurerm_resource_group" "yogeshrgblock" {
  for_each = var.rgs
  name     = each.value.rgname
  location = each.value.location
}

// i want output as key rgname and value should be location
output "location" {
  value = { for k, v in azurerm_resource_group.yogeshrgblock : v.name => v.location }
}
