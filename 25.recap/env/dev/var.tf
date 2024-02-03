variable "resources" {
    type = map(any)
    default = {}
}

variable "vnets" {
    type = map(any)
    default = {}
}

variable "tags" {
    type = map(any)
    default = {
        env = "dev"
    }
}


variable "keyvault" {
    type = map(any)
    default = {}
}

variable "subnets" {
    type = map(any)
    default = {}
}

variable "vms" {
    type = map(any)
    default = {}
}