data "azurerm_network_interface" "existing_nic" {
  for_each            = var.vms
  name                = each.value.nicname
  resource_group_name = each.value.rgname
}


resource "azurerm_virtual_machine" "main" {
  for_each              = var.vms
  name                  = each.value.vmname
  location              = each.value.location
  resource_group_name   = each.value.rgname
  network_interface_ids = [data.azurerm_network_interface.existing_nic[each.key].id]
  vm_size               = each.value.vm_size

  storage_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
  storage_os_disk {
    name              = each.value.osname
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }
  os_profile {
    computer_name  = "yugmachine"
    admin_username = "yug"
    admin_password = "Yogesh@72448"
  }
  os_profile_linux_config {
    disable_password_authentication = false
  }
  tags = {
    environment = "staging"
  }
}


