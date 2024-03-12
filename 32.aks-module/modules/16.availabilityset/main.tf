resource "azurerm_availability_set" "azaset" {
  for_each            = var.availabilitysets
  name                = each.value.asetname
  location            = each.value.location
  resource_group_name = each.value.rgname

  tags = {
    environment = "Development"
  }
}

