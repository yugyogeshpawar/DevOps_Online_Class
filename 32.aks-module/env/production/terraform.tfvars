todoresource = {
  # rg1 = {
  #   rgname   = "yugrg5"
  #   location = "west us"
  # }
  rg2 = {
    rgname   = "yugaksrg"
    location = "East US 2"
  }
}


# vnets = {
#   vnet1 = {
#     rgname        = "yugrg5"
#     vnaddresspace = ["10.0.0.0/16"]
#     vnetname      = "yugvnet1"
#     location      = "central india"
#   }
#   vnet2 = {
#     rgname        = "yugrg10"
#     vnaddresspace = ["10.0.0.0/16"]
#     vnetname      = "yugvnet2"
#   }
# }


# subnets = {
#   subnet1 = {
#     rgname                  = "yugrg1"
#     vnetname                = "yugvnet1"
#     subnetname              = "subnet1"
#     address_prefixes_subnet = ["10.0.0.0/24"]
#   }
#   subnet2 = {
#     rgname                  = "yugrg1"
#     vnetname                = "yugvnet1"
#     subnetname              = "AzureBastionSubnet"
#     address_prefixes_subnet = ["10.0.1.0/24"]
#   }
#   subnet3 = {
#     rgname                  = "yugrg1"
#     vnetname                = "yugvnet1"
#     subnetname              = "subnet2"
#     address_prefixes_subnet = ["10.0.2.0/24"]
#   }
# }


# nics = {
#   nic1 = {
#     rgname          = "yugrg1"
#     location        = "west us"
#     subnetname      = "subnet1"
#     vnetname        = "yugvnet1"
#     nicname         = "front-todo-nic"
#     availabilityset = "availabilityset1"
#     ipconfigname    = "publicip1"
#   }
#   nic2 = {
#     rgname          = "yugrg1"
#     location        = "west us"
#     subnetname      = "subnet1"
#     vnetname        = "yugvnet1"
#     nicname         = "front-todo-nic2"
#     availabilityset = "availabilityset1"
#     ipconfigname    = "publicip2"
#   }
# }

# nsgs = {
#   nsg1 = {
#     rgname     = "yugrg1"
#     location   = "west us"
#     vnetname   = "yugvnet1"
#     subnetname = "subnet1"
#     nicname    = "front-todo-nic"
#     nsgname    = "securitygrouptodo"
#     vmname     = "todofrontend1"
#   }
# }

# nsgassociation = {
#   nsgassociation1 = {
#     nicname = "front-todo-nic"
#     rgname  = "yugrg1"
#     nsgname = "securitygrouptodo"
#   }
#   nsgassociation2 = {
#     nicname = "front-todo-nic2"
#     rgname  = "yugrg1"
#     nsgname = "securitygrouptodo"
#   }
# }

# publicips = {
#   pip1 = {
#     rgname   = "yugrg1"
#     location = "west us"
#     ipname   = "publicip1"
#   }
#   # pip2 = {
#   #   rgname   = "yugrg1"
#   #   location = "west us"
#   #   ipname   = "publicip2"
#   # }
# }

# vms = {
#   vm1 = {
#     rgname     = "yugrg1"
#     location   = "west us"
#     vnetname   = "yugvnet1"
#     subnetname = "subnet1"
#     nicname    = "front-todo-nic"
#     nsgname    = "securitygrouptodo"
#     vmname     = "todofrontend1"
#     osname     = "myosdisk1"
#     vm_size    = "Standard_D1_v2"
#   }

#   vm2 = {
#     rgname     = "yugrg1"
#     location   = "west us"
#     vnetname   = "yugvnet1"
#     subnetname = "subnet1"
#     nicname    = "front-todo-nic2"
#     nsgname    = "securitygrouptodo2"
#     vmname     = "todofrontend3"
#     osname     = "myosdisk2"
#     vm_size    = "Standard_D1_v2"
#   }
# }



basion = {
  # basion1 = {
  #   subnetname   = "AzureBastionSubnet"
  #   vnetname     = "yugvnet1"
  #   rgname       = "yugrg1"
  #   ipname       = "bastionip"
  #   ipconfigname = "bastionip"
  #   bastionname  = "yugbasion"
  #   location     = "west us"
  # }
}


# lbs = {
#   # lb1 = {
#   #   lbname        = "todo-lb"
#   #   rgname        = "yugrg1"
#   #   location      = "west us"
#   #   lbprobname    = "lb-probe"
#   #   lbbackendname = "lb-backend-pool"
#   #   lbrulename    = "lb-rule"
#   #   ipname        = "PublicIPAddress"
#   # }
# }


# azlbassociation = {
#   # lb_association1 = {
#   #   lbname        = "todo-lb"
#   #   rgname        = "yugrg1"
#   #   nicname       = "front-todo-nic"
#   #   nsgname       = "securitygrouptodo"
#   #   ipname        = "publicip1"
#   #   lbbackendname = "lb-backend-pool"
#   #   ipconfigname  = "publicip1"
#   # }

#   # lb_association2 = {
#   #   lbname        = "todo-lb"
#   #   rgname        = "yugrg1"
#   #   nicname       = "front-todo-nic2"
#   #   nsgname       = "securitygrouptodo2"
#   #   ipname        = "publicip2"
#   #   lbbackendname = "lb-backend-pool"
#   #   ipconfigname  = "publicip2"
#   # }
# }

# appgateways = {
#   gateway1 = {
#     appgatewayname = "yugappgateway2"
#     rgname         = "yugrg1"
#     location       = "west us"
#     skuname        = "Standard_v2"
#     skutier        = "Standard_v2"
#     capacity       = 2
#     ipname         = "publicip1"
#     subnetname     = "subnet2"
#     vnetname       = "yugvnet1"
#     frontend_ports = {
#       "post1" = 80
#     }
#   }
# }

# azappassociation = {
#     gateway1 = {
#       appgatewayname = "yugappgateway"
#       rgname         = "yugrg1"
#       nicname        = "front-todo-nic"

#       ipconfigname   = "publicip1"
#     }
#      gateway2 = {
#       appgatewayname = "yugappgateway"
#       rgname         = "yugrg1"
#       nicname        = "front-todo-nic2"
#       ipconfigname   = "publicip2"
#     }
# }


aks = {
  aks1 = {
    aksname  = "yugaks"
    location = "East US 2"
    rgname   = "yugaksrg"
    aksdns   = "exampleaks1"
    capacity = 1
    vmsize   = "Standard_D2_v2"
    poolname = "default"
    skutier = "Free"
  }
}
