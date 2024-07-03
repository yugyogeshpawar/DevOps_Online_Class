rgs = {
  "rg1" = {
    rgname   = "yug-rg-1"
    location = "east us"
  }
}

nsgs = {
  nsg1 = {
    name                = "example-security-group"
    location            = "east us"
    resource_group_name = "yug-rg-1"
  }
}

vnets = {
  vnet1 = {
    name                = "vnet1"
    location            = "east us"
    address_space       = ["10.0.0.0/16"]
    resource_group_name = "yug-rg-1"
  }
}

subnets = {
  subnet1 = {
    subnetname          = "subnet1"
    address_prefixes    = ["10.0.0.0/24"]
    vnetname            = "vnet1"
    resource_group_name = "yug-rg-1"
    nsgname  = "example-security-group"
  }
}


nics = {
  nic1 = {
    name                          = "nic1"
    location                      = "east us"
    resource_group_name           = "yug-rg-1"
    ip_conf_name                  = "testconfiguration1"
    private_ip_address_allocation = "Dynamic"
    subnetname                    = "subnet1"
    vnetname                      = "vnet1"
    # subnetid= "/subscriptions/f0459865-508b-40f8-9d1d-21ddf74ebf08/resourceGroups/yug-rg-1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1"
    pubipname = "pip1"
  }
}

vms = {
  vm1 = {
    name                 = "yug-vm"
    resource_group_name  = "yug-rg-1"
    location             = "east us"
    size                 = "Standard_F2"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
    publisher            = "Canonical"
    offer                = "0001-com-ubuntu-server-jammy"
    sku                  = "22_04-lts"
    version              = "latest"
    nicname              = "nic1"
    key_vault_name       = "testvmwithk1"
    admin_username       = "testuser"
    admin_password       = "password"

  }
}


pubips = {
  pubips1 = {
    name                = "pip1"
    resource_group_name = "yug-rg-1"
    location            = "east us"
    allocation_method   = "Static"
    sku                 = "Standard"
    sku_tier            = "Regional"
    nicname             = "nic1"
  }
}
