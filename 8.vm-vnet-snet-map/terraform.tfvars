resource_group_name = "yogesh-tf-rg"
location            = "East US"
vnet_name           = "yogesh-tf-vnet"

vm_config = {
  yug_tf_vm = {
    vm_name         = "yug-tf-vm"
    vm_size         = "Standard_DS1_v2"
    admin_username  = "yug"
    admin_password  = "Yogesh@72448"
    os_disk_size_gb = 30
    image_publisher = "MicrosoftWindowsServer"
    image_offer     = "WindowsServer"
    image_sku       = "2019-datacenter"
    image_version   = "latest"
    subnet_name     = "subnet1"
    vnet_name       = "yug-tf-vnet"
} }
