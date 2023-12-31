variable "resource_group_name" {
  type    = string
  default = "yogesh-tf-rg"
}

variable "location" {
  type    = string
  default = "East US"
}

variable "vnet_name" {
  type    = string
  default = "yogesh-tf-vnet"
}

variable "vm_config" {
  type = map(object({
    vm_name           = string
    vm_size           = string
    admin_username    = string
    admin_password    = string
    os_disk_size_gb   = number
    image_publisher   = string
    image_offer       = string
    image_sku         = string
    image_version     = string
    subnet_name       = string
  }))
  default = {
    example_vm = {
      vm_name           = "yogesh-tf-vm"
      vm_size           = "Standard_DS1_v2"
      admin_username    = "adminuser"
      admin_password    = "Password123!"
      os_disk_size_gb   = 30
      image_publisher   = "Canonical"
      image_offer       = "UbuntuServer"
      image_sku         = "22_04-lts"
      image_version     = "latest"
      subnet_name       = "subnet1"
    }
  }
}
