

data "azurerm_resource_group" "existing_rg" {
  for_each = var.vms
  name     = each.value.rgname
}


data "azurerm_subnet" "existing_subnet" {
  for_each             = var.vms
  name                 = each.value.subnet
  virtual_network_name = each.value.vnet
  resource_group_name  = data.azurerm_resource_group.existing_rg[each.key].name
}

resource "azurerm_network_interface" "example" {
  for_each            = var.vms
  name                = each.value.nicname
  location            = each.value.location
  resource_group_name = each.value.rgname
  ip_configuration {
    name                          = "internal"
    subnet_id                     = data.azurerm_resource_group.existing_rg[each.key].id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_linux_virtual_machine" "example" {
  for_each            = var.vms
  name                = each.value.vmname
  resource_group_name = each.value.rgname
  location            = each.value.location
  size                = each.value.size
  admin_username      = "adminuser"
  admin_password      = "Yogesh"
  network_interface_ids = [
    azurerm_network_interface.example[each.key].id
  ]
  disable_password_authentication = false
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






