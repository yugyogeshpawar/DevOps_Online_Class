resource "azurerm_resource_group" "example" {
  name     = "yug-resources2"
  location = "South Central US"
}

resource "azurerm_virtual_network" "example" {
  name                = "yug-network2"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
}

resource "azurerm_subnet" "example" {
  name                 = "internal"
  resource_group_name  = azurerm_resource_group.example.name
  virtual_network_name = azurerm_virtual_network.example.name
  address_prefixes     = ["10.0.2.0/24"]
}
resource "azurerm_public_ip" "example" {
  name                = "acceptanceTestPublicIp12"
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location
  allocation_method   = "Static"


}
resource "azurerm_network_interface" "example" {
  name                = "yug-nic2"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.example.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.example.id
  }
}

resource "azurerm_network_security_group" "example" {
  name                = "yug-nsg2"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name

  security_rule {
    name                       = "test123"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

    security_rule {
    name                       = "test122"
    priority                   = 101
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
   security_rule {
    name                       = "test1223"
    priority                   = 103
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "8000"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_subnet_network_security_group_association" "example" {
  subnet_id                 = azurerm_subnet.example.id
  network_security_group_id = azurerm_network_security_group.example.id
}

resource "azurerm_linux_virtual_machine" "vms" {

  name                            = "vm01"
  resource_group_name             = azurerm_resource_group.example.name
  location                        = azurerm_resource_group.example.location
  size                            = "Standard_D1_v2"
  admin_username                  = "yug"
  admin_password                  = "Yogesh@72448"
  disable_password_authentication = false
  network_interface_ids = [
    azurerm_network_interface.example.id,
  ]



  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts"
    version   = "latest"
  }
  connection {
    host     = self.public_ip_address
    type     = "ssh"
    user     = self.admin_username
    password = self.admin_password
    timeout  = "2m"
  }
  provisioner "remote-exec" {
    inline = ["sudo apt update", "sudo apt install nginx -y", "sudo git clone https://github.com/devopsinsiders/todoapp-backend-py.git","cd todoapp-backend-py", "sudo apt install python3",  "sudo apt install python3-pip -y","pip install -r requirements.txt","sudo apt-get update && sudo  apt-get install -y unixodbc unixodbc-dev","sudo curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -", "sudo curl https://packages.microsoft.com/config/debian/10/prod.list > sudo /etc/apt/sources.list.d/mssql-release.list","sudo apt-get update", "sudo ACCEPT_EULA=Y apt-get install -y msodbcsql17", "sudo su", " sudo pip install -r requirements.txt && sudo apt-get update && sudo apt-get install -y unixodbc unixodbc-dev && sudo curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add - && sudo curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list && apt-get update && sudo ACCEPT_EULA=Y apt-get install -y msodbcsql17 && sudo pip install -r requirements.txt && sudo uvicorn app:app --host 0.0.0.0 --port 8000 &"
    ]
  }
  provisioner "local-exec" {
    command = "echo backend complete > complete.txt"
  }
}