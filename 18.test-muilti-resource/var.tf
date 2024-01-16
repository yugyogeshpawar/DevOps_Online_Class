variable "vm_config" {
  type = map(object({
    vm_name             = string
    vm_size             = string
    vnetname            = string
    resource_group_name = string
    location            = string
    admin_username      = string
    admin_password      = string
    subnet_name         = string
  }))
  default = {}
}
