data "azurerm_network_interface" "existing-nic" {
  for_each            = var.vms
  name                = each.value.nicname
  resource_group_name = each.value.resource_group_name
}

data "azurerm_key_vault" "vm-keyvalut" {
  for_each            = var.vms
  name                = each.value.key_vault_name
  resource_group_name = each.value.resource_group_name
}


data "azurerm_key_vault_secret" "vault-username" {
  for_each     = var.vms
  name         = each.value.admin_username
  key_vault_id = data.azurerm_key_vault.vm-keyvalut[each.key].id
}

data "azurerm_key_vault_secret" "vault-password" {
  for_each     = var.vms
  name         = each.value.admin_password
  key_vault_id = data.azurerm_key_vault.vm-keyvalut[each.key].id
}

resource "azurerm_linux_virtual_machine" "example" {
  for_each                        = var.vms
  name                            = each.value.name
  resource_group_name             = each.value.resource_group_name
  location                        = each.value.location
  size                            = each.value.size
  admin_username                  = data.azurerm_key_vault_secret.vault-username[each.key].value
  admin_password                  = data.azurerm_key_vault_secret.vault-password[each.key].value
  disable_password_authentication = false
  network_interface_ids = [
    data.azurerm_network_interface.existing-nic[each.key].id,
  ]
  os_disk {
    caching              = each.value.caching
    storage_account_type = each.value.storage_account_type
  }

  source_image_reference {
    publisher = each.value.publisher
    offer     = each.value.offer
    sku       = each.value.sku
    version   = each.value.version
  }
}


# add public ip

resource "azurerm_public_ip" "example" {
  for_each            = var.pubips
  name                = each.value.name
  resource_group_name = each.value.resource_group_name
  location            = each.value.location
  allocation_method   = each.value.allocation_method
  sku                 = each.value.sku
  sku_tier            = each.value.sku_tier
}


