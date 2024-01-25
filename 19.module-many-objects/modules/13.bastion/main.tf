# resource "azurerm_subnet" "bastion_subnet" {
#   for_each             = var.basion
#   name                 = each.value.subnetname
#   resource_group_name  = each.value.rgname
#   virtual_network_name = each.value.vnetname
#   address_prefixes     = each.value.address_prefixes
# }

data "azurerm_subnet" "existing_subnet" {
  for_each = var.basion
  name                 = each.value.subnetname
  virtual_network_name = each.value.vnetname
  resource_group_name  = each.value.rgname
}

resource "azurerm_public_ip" "bastion_public_ip" {
  for_each            = var.basion
  name                = each.value.ipname
  location            = each.value.location
  resource_group_name = each.value.rgname
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_bastion_host" "yogeshbastion" {
  for_each            = var.basion
  name                = each.value.bastionname
  location            = each.value.location
  resource_group_name = each.value.rgname

  ip_configuration {
    name                 = each.value.ipconfigname
    subnet_id            = data.azurerm_subnet.existing_subnet[each.key].id
    public_ip_address_id = azurerm_public_ip.bastion_public_ip[each.key].id
  }
}
