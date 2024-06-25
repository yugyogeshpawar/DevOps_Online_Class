## Question 1: Write VM code without registry in terraform with azure provider:

```terraform



resource "azurerm_linux_virtual_machine" "linux_vms"{
    for_each = var.vms
    name = each.value.vmname
    location = each.value.location
    resource_group_name = each.value.resource_group_name
    size = each.value.vmsize
    admin_username = data.azurerm_key_vault.username[each.key].value
    admin_password = data.azurerm_key_vault.userpassword[each.key].value
    network_interface_ids = [
        azurerm_network_interface.example.id,
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

```
