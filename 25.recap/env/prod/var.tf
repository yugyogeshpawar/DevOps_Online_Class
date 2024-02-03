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
        env = "prod"
    }
}