subnets = {
  subnet1 = {
    rgname           = "yugtodoapprg"
    vnet             = "todo-vn"
    address_prefixes = ["10.0.2.0/24"]
  }
  AzureBastionSubnet = {
    rgname           = "yugtodoapprg"
    vnet             = "todo-vn"
    address_prefixes = ["10.0.3.0/24"]
  }
  subnet_bastion = {
    rgname           = "yugtodoapprg"
    vnet             = "todo-vn"
    address_prefixes = ["10.0.4.0/24"]
  }

}
