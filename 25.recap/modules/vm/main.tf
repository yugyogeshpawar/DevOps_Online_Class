
data "azurerm_key_vault" "existing" {
  for_each            = var.vms
  name                = each.value.keyvaultname
  resource_group_name = each.value.rgname
}

data "azurerm_network_interface" "name" {
  for_each            = var.vms
  name                = each.value.nicname
  resource_group_name = each.value.rgname
}

resource "azurerm_linux_virtual_machine" "example" {
  for_each            = var.vms
  name                = each.value.vmname
  resource_group_name = each.value.rgname
  location            = each.value.location
  size                = "Standard_F2"
  admin_username      = data.azurerm_key_vault.existing[each.key].secrets[0].value
  admin_password      = data.azurerm_key_vault.existing[each.key].secrets[1].value
  network_interface_ids = [
    data.azurerm_network_interface.name[each.key].id
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
}
