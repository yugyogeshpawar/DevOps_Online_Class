vm_config = {
  "vm1" = {
    vm_name             = "my-vm1"
    vm_size             = "Standard_DS1_v2"
    resource_group_name = "rg-2"
    vnetname            = "rgnet1"
    location            = "East US"
    admin_username      = "yug"
    admin_password      = "Yogesh@72448"
    subnet_name         = "subnet1"
  }

  "vm2" = {
    vm_name             = "my-vm2"
    vm_size             = "Standard_DS1_v2"
    resource_group_name = "rg-2"
    vnetname            = "rgnet2"
    location            = "East US"
    admin_username      = "yug"
    admin_password      = "Yogesh@72448"
    subnet_name         = "subnet2"
  }
}
