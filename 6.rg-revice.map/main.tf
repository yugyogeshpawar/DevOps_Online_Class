resource "azurerm_resource_group" "resource_group_block" {
    for_each = var.rg_names
    name = each.value.name
    location = each.value.location
}