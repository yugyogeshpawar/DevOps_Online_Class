resource "azurerm_resource_group" "example" {
  name     = "yug-resources"
  location = "central india"
}


resource "azurerm_network_security_group" "example" {
  name                = "example-security-group"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
}

resource "azurerm_virtual_network" "example" {
  name                = "example-network"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  address_space       = ["10.0.0.0/16"]
  dns_servers         = ["10.0.0.4", "10.0.0.5"]
}


resource "azurerm_subnet" "example" {
  name                 = "subnet1"
  resource_group_name  = azurerm_resource_group.example.name
  virtual_network_name = azurerm_virtual_network.example.name
  address_prefixes     = ["10.0.2.0/24"]
}


resource "azurerm_public_ip" "example" {
  name                = "pip-example"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  allocation_method   = "Dynamic"
}


resource "azurerm_network_interface" "example" {
  name                = "example-nic"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.example.id
    public_ip_address_id          = azurerm_public_ip.example.id
    private_ip_address_allocation = "Dynamic"
  }
}


resource "tls_private_key" "linux_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "linuxkey" {
  filename = "eus-stst-p-a-01key.pem"
  content  = tls_private_key.linux_key.private_key_pem
}

resource "azurerm_linux_virtual_machine" "prod" {
  name                = "eus-stst-p-a-01"
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location
  size                = "Standard_B8ms"
  admin_username      = "appuser"
  network_interface_ids = [
    azurerm_network_interface.example.id
  ]
  admin_ssh_key {
    username   = "appuser"
    public_key = tls_private_key.linux_key.public_key_openssh
  }
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
