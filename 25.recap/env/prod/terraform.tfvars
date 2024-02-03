resources = {
  rg1 = {
    rgname   = "cp4"
    location = "west europe"
  }
}

vnets = {
  vnet1 = {
    vnetname = "vnetcp4"
    location = "west europe"
    rgname = "cp4"
    address_space = ["10.0.0.0/16"]
    
  }
}
