

resource "azurerm_resource_group" "example" {
  name     = "example-resources"
  location = "West Europe"
}

resource "azurerm_virtual_network" "example" {
    
  name                = "example-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
}

resource "azurerm_subnet" "example" {
    for_each = var.yogeshvm
  name                 = each.value.sname
  resource_group_name  = azurerm_resource_group.example.name
  virtual_network_name = azurerm_virtual_network.example.name
  address_prefixes     = each.value.address_prefixes
}

resource "azurerm_network_interface" "example" {
    for_each = var.yogeshvm
  name                = each.value.nicname
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.example[each.key].id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_windows_virtual_machine" "example" {
    for_each = var.yogeshvm
  name                = each.value.vmname
  resource_group_name = each.value. resource_group_name
  location            = each.value.location 
  size                = each.value.size
  admin_username      = each.value.admin_username
  admin_password      = each.value.admin_password
  network_interface_ids = [
    azurerm_network_interface.example[each.key].id,
  ]

  dynamic "os_disk" {
    for_each = var.yogeshvm
    content {
      
    
    caching              = each.value.cashing
    storage_account_type = "Standard_LRS"
    }
  }

  source_image_reference {
    publisher = "MicrosoftWindowsServer"
    offer     = "WindowsServer"
    sku       = "2016-Datacenter"
    version   = "latest"
  }
}