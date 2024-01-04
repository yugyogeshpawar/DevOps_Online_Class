
resource "azurerm_virtual_machine" "main" {
  name                  = "fronted-vm"
  location              = "West US"
  resource_group_name   = "todoapprg"
  network_interface_ids = ["/subscriptions/1d7ad62d-b735-4870-a659-a63196825b3b/resourceGroups/todoapprg/providers/Microsoft.Network/networkInterfaces/todo-nic"]
  vm_size               = "Standard_DS1_v2"

  storage_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
  storage_os_disk {
    name              = "myosdisk1"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }
  os_profile {
    computer_name  = "yug"
    admin_username = "adminuser"
    admin_password = "admin@1234"
  }
  os_profile_linux_config {
    disable_password_authentication = false
  }
  tags = {
    environment = "staging"
  }
}



resource "azurerm_virtual_machine" "backend" {
  name                  = "backend-vm"
  location              = "West US"
  resource_group_name   = "todoapprg"
  network_interface_ids = ["/subscriptions/1d7ad62d-b735-4870-a659-a63196825b3b/resourceGroups/todoapprg/providers/Microsoft.Network/networkInterfaces/todo-backend-nic"]
  vm_size               = "Standard_DS1_v2"

  storage_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
  storage_os_disk {
    name              = "myosdisk2"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }
  os_profile {
    computer_name  = "yug"
    admin_username = "adminuser"
    admin_password = "admin@1234"
  }
  os_profile_linux_config {
    disable_password_authentication = false
  }
  tags = {
    environment = "staging"
  }
}