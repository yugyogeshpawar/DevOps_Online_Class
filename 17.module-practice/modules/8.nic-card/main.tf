# 8.nic-card/main.tf

resource "azurerm_network_interface" "nic" {
  for_each            = var.rgs
  name                = "${each.value.rgname}-nic"
  location            = each.value.location
  resource_group_name = each.value.rgname

  ip_configuration {
    name                          = "ipconfig1"
    subnet_id                     = module.subnet.subnet_id[each.key]
    private_ip_address_allocation = "Dynamic"
  }

  tags = {
    environment = "development"
  }
}
