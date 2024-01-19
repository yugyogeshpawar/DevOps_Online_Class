
resource "azurerm_resource_group" "rg" {
  for_each = var.vm_config

  name     = each.value.resource_group_name
  location = each.value.location
}

resource "azurerm_virtual_network" "vnet" {
  for_each = var.vm_config

  name                = each.value.vnetname
  location            = azurerm_resource_group.rg[each.key].location
  resource_group_name = azurerm_resource_group.rg[each.key].name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "subnet" {
  for_each = var.vm_config

  name                 = each.value.subnet_name
  resource_group_name  = azurerm_resource_group.rg[each.key].name
  virtual_network_name = azurerm_virtual_network.vnet[each.key].name
  address_prefixes     = ["10.0.1.0/24"]
}


resource "azurerm_linux_virtual_machine" "vm" {
  for_each = var.vm_config

  name                            = each.value.vm_name
  resource_group_name             = azurerm_resource_group.rg[each.key].name
  location                        = azurerm_resource_group.rg[each.key].location
  size                            = each.value.vm_size
  admin_username                  = each.value.admin_username
  admin_password                  = each.value.admin_password
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

  network_interface_ids = [azurerm_network_interface.nic[each.key].id]
}

resource "azurerm_network_interface" "nic" {
  for_each = var.vm_config

  name                = "${each.value.vm_name}-nic"
  location            = azurerm_resource_group.rg[each.key].location
  resource_group_name = azurerm_resource_group.rg[each.key].name

  ip_configuration {
    name                          = "internal"
    private_ip_address_allocation = "Dynamic"
    subnet_id                     = azurerm_subnet.subnet[each.key].id
  }
}

# resource "azurerm_lb" "lb" {
#   for_each = var.vm_config

#   name                = "${each.value.resource_group_name}-lb"
#   resource_group_name = azurerm_resource_group.rg[each.key].name
#   location            = azurerm_resource_group.rg[each.key].location
#   sku                 = "Standard"

#   frontend_ip_configuration {
#     name                 = "lb-fe-ip"
#     public_ip_address_id = azurerm_public_ip.lb_public_ip[each.key].id
#   }
# }

# resource "azurerm_public_ip" "lb_public_ip" {
#   for_each = var.vm_config

#   name                = "${each.value.resource_group_name}-lb-public-ip"
#   resource_group_name = azurerm_resource_group.rg[each.key].name
#   location            = azurerm_resource_group.rg[each.key].location
#   allocation_method   = "Static"
#   sku                 = "Standard"
# }

# resource "azurerm_lb_backend_address_pool" "pool" {
#   for_each = var.vm_config

#   name            = "${each.value.resource_group_name}-pool"
#   loadbalancer_id = azurerm_lb.lb[each.key].id
# }

# resource "azurerm_network_interface_backend_address_pool_association" "nic_pool_assoc" {
#   for_each = var.vm_config

#   network_interface_id    = azurerm_network_interface.nic[each.key].id
#   ip_configuration_name   = azurerm_network_interface.nic[each.key].ip_configuration[0].name
#   backend_address_pool_id = azurerm_lb_backend_address_pool.pool[each.key].id
# }
