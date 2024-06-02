resource "azurerm_public_ip" "todopublicip" {
  for_each = var.ipps
  name                = each.value.ipname
  location            = each.value.location
  resource_group_name = each.value.rgname
  allocation_method   = "Static"
  sku                 = "Standard"
}

