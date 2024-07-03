resource "azurerm_resource_group" "rgs-block" {
  for_each = var.rgs
  name     = each.value.rgname
  location = each.value.location
}


resource "azurerm_network_security_group" "example" {
  for_each            = var.nsgs
  name                = each.value.name
  location            = each.value.location
  resource_group_name = each.value.resource_group_name
  depends_on          = [azurerm_resource_group.rgs-block]


  security_rule {
    name                       = "test123"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}


resource "azurerm_virtual_network" "vnets" {
  for_each            = var.vnets
  name                = each.value.name
  location            = each.value.location
  address_space       = each.value.address_space
  resource_group_name = each.value.resource_group_name
  depends_on          = [azurerm_resource_group.rgs-block]
}

resource "azurerm_subnet" "subnet-block" {
  for_each             = var.subnets
  name                 = each.value.subnetname
  address_prefixes     = each.value.address_prefixes
  virtual_network_name = each.value.vnetname
  resource_group_name  = each.value.resource_group_name

  depends_on           = [azurerm_virtual_network.vnets]
}

data "azurerm_network_security_group" "existing-nsg" {
  for_each = var.subnets
  name     = each.value.nsgname
  resource_group_name = each.value.resource_group_name
  depends_on = [azurerm_network_security_group.example]
}

resource "azurerm_subnet_network_security_group_association" "association-nsg-subnet" {
  for_each = var.subnets
  subnet_id                 = azurerm_subnet.subnet-block[each.key].id
  network_security_group_id = data.azurerm_network_security_group.existing-nsg[each.key].id
}


data "azurerm_subnet" "existing-subnet" {
  for_each             = var.nics
  name                 = each.value.subnetname
  virtual_network_name = each.value.vnetname
  resource_group_name  = each.value.resource_group_name
  depends_on           = [azurerm_virtual_network.vnets]
}



data "azurerm_public_ip" "existing-pubip" {
  for_each            = var.nics
  name                = each.value.pubipname
  resource_group_name = each.value.resource_group_name
  depends_on          = [azurerm_resource_group.rgs-block]
}


resource "azurerm_network_interface" "nic-block" {
  for_each            = var.nics
  name                = each.value.name
  location            = each.value.location
  resource_group_name = each.value.resource_group_name
  ip_configuration {
    name      = each.value.ip_conf_name
    subnet_id = data.azurerm_subnet.existing-subnet[each.key].id
    # subnet_id                     = each.value.subnetid
    private_ip_address_allocation = each.value.private_ip_address_allocation
    public_ip_address_id          = data.azurerm_public_ip.existing-pubip[each.key].id
  }
}


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


