todoresource = {
  vm1 = {
    rgname                  = "yugrg1"
    location                = "west us"
    vnaddresspace           = ["10.0.0.0/16"]
    vnetname                = "yugvnet1"
    subnetname              = "subnet1"
    address_prefixes_subnet = ["10.0.0.0/24"]
    nicname                 = "front-todo-nic"
    nsgname                 = "securitygrouptodo"
    vmname                  = "todofrontend1"
    osname                  = "myosdisk1"
    vm_size                 = "Standard_D1_v2"
    ipname                  = "publicip1"
  },
  vm2 = {
    rgname                  = "yugrg1"
    location                = "west us"
    vnaddresspace           = ["10.0.0.0/16"]
    vnetname                = "yugvnet1"
    subnetname              = "subnet1"
    address_prefixes_subnet = ["10.0.0.0/24"]
    nicname                 = "front-todo-nic2"
    nsgname                 = "securitygrouptodo"
    vmname                  = "todofrontend2"
    osname                  = "myosdisk2"
    vm_size                 = "Standard_D1_v2"
    ipname                  = "publicip2"
  }
}



lbs = {
  lb1 = {
    lbname        = "todo-lb"
    rgname        = "yugrg1"
    location      = "west us"
    lbprobname    = "lb-probe"
    lbbackendname = "lb-backend-pool"
    lbrulename    = "lb-rule"
    nicname       = "front-todo-nic"
    ipname        = "PublicIPAddress"
  }
}

azlbassociation = {
  association1 = {
    nicname       = "front-todo-nic"
    rgname        = "yugrg1"
    lbname        = "todo-lb"
    lbbackendname = "lb-backend-pool"
  }
}







