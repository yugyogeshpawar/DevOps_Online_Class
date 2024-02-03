variable "rgs" {
    type = map(
        object({
            rgname     = string
            location   = string
            managed_by = optional(string)
        })
    )
    default = {}
}
variable "vnets" {
    type = map(any)
    default = {}
}

variable "subnets" {
    type = map(any)
}

variable "nsgs" {
    type = map(any)
    default = {}
}

variable "vms" {
    type = map(any)
    default = {}
}