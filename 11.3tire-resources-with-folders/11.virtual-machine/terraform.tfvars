vms = {
  vm1 = {
    name                  = "fronted-vm"
    location              = "West US"
    resource_group_name   = "yugtodoapprg"
    network_interface_ids = ["/subscriptions/1d7ad62d-b735-4870-a659-a63196825b3b/resourceGroups/yugtodoapprg/providers/Microsoft.Network/networkInterfaces/todo-nic"]
    vm_size               = "standard_ds2_v2"
    osname                = "myosdisk1"
  }
  vm2 = {
    name                  = "backend-vm"
    location              = "West US"
    resource_group_name   = "yugtodoapprg"
    network_interface_ids = ["/subscriptions/1d7ad62d-b735-4870-a659-a63196825b3b/resourceGroups/yugtodoapprg/providers/Microsoft.Network/networkInterfaces/todo-backend-nic",]
    vm_size               = "standard_ds2_v2"
    osname                = "myosdisk2"
  }

}
