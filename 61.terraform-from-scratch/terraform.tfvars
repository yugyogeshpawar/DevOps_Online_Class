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
  }
}
