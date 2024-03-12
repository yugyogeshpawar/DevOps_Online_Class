resource "azurerm_linux_virtual_machine" "main" {
  for_each            = var.vms
  name                = each.value.vmname
  location            = each.value.location
  resource_group_name = each.value.rgname

  network_interface_ids = [lookup(var.nics,  each.value.nicname, null)]

  size = each.value.vm_size

  admin_username = "yug"
  admin_password = "Yogesh@72448"

  disable_password_authentication = false

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest" # Consider specifying a fixed version
  }

  os_disk {
    name                 = each.value.osname
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
    disk_size_gb         = 30 # Specify disk size if needed
  }

  computer_name = "yugmachine" # Consider making this unique per VM

  tags = {
    environment = "staging"
  }
}
