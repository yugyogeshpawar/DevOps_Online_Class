rgs = {
  rg1 = {
    rgname   = "tiwari"
    location = "centralindia"
  }
}

vnets = {
  vnet1 = {
    rgname        = "tiwari"
    vnetname      = "tiwari-vnet"
    address_space = ["10.0.0.0/16"]
  }
}


subnets = {
  subnet = {
    name           = "subnet1"
    address_prefix = "10.0.0.0/24"
  }
  subnet2 = {
    name           = "subnet2"
    address_prefix = "10.0.1.0/24"
  }
}

nsgs = {
  nsg1 = {
    nsgname  = "nsg1"
    location = "centralindia"
    rgname   = "tiwari"
  }
}

vms = {
  vm1 = {
    rgname   = "tiwari"
    location = "centralindia"
    vmname   = "vm-1"
    nicname  = "vm-1-nic"
    subnet   = "subnet1"
    size     = "Standard_B1s"
  }
}
