resources = {
  rg1 = {
    rgname   = "cp4"
    location = "west europe"
  }
}

vnets = {
  vnet1 = {
    vnetname      = "vnetcp4"
    location      = "west europe"
    rgname        = "cp4"
    address_space = ["10.0.0.0/16"]

  }
}

keyvault = {
  keyvault1 = {
    keyvaultname = "cpkeyvault75593"
    location     = "west europe"
    rgname       = "cp4"
  }
}

subnets = {
  subnet1 = {
    subnetname    = "subnet"
    rgname        = "cp4"
    vnetname      = "vnetcp4"
    address_space = ["10.0.1.0/24"]
  }
}

vms = {
  vm1 = {
    keyvaultname = "cpkeyvault75593"
    rgname       = "cp4"
    location     = "west europe"
    nicname = ""
    vmname = ""
  }
}
