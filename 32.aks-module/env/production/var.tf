variable "todoresource" {
  default = {}
  type    = map(any)
}

variable "lbs" {
  default = {}
  type    = map(any)
}

variable "azlbassociation" {
  default = {}
  type    = map(any)
}

variable "vms" {
  default = {}
  type    = map(any)
}

variable "publicips" {
  default = {}
  type    = map(any)
}

variable "nics" {
  default = {}
  type    = map(any)
}

variable "nsgs" {
  default = {}
  type    = map(any)
}

variable "nsgassociation" {
  default = {}
  type    = map(any)
}

variable "basion" {
  default = {}
  type    = map(any)
}

variable "subnets" {
  default = {}
  type    = map(any)
}

variable "appgateways" {
  default = {}
  type    = map(any)
}

variable "azappassociation" {
  default = {}
  type    = map(any)
}



variable "vnets" {
  default = {}
  type = map(object({
    rgname     = string
    vnaddresspace = list(string)
    location = optional(string)
    vnetname = string
  }))
}


variable "aks" {
  default = {}
  type    = map(any)
}