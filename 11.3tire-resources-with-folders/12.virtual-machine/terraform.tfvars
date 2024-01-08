vms = {
  vm1 = {
    name                  = "fronted-vm"
    location              = "South Central US"
    resource_group_name   = "yugtodoapprg"
    network_interface_ids = ["/subscriptions/b46c125c-073e-4204-83e3-4c2eef053249/resourceGroups/yugtodoapprg/providers/Microsoft.Network/networkInterfaces/todo-nic"]
    vm_size               = "standard_ds2_v2"
    osname                = "myosdisk1"
  }
  vm2 = {
    name                  = "backend-vm"
    location              = "South Central US"
    resource_group_name   = "yugtodoapprg"
    network_interface_ids = ["/subscriptions/b46c125c-073e-4204-83e3-4c2eef053249/resourceGroups/yugtodoapprg/providers/Microsoft.Network/networkInterfaces/todo-backend-nic"]
    vm_size               = "standard_ds2_v2"
    osname                = "myosdisk2"
  }

}
