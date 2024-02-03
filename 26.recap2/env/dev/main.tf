
module "resource_groups" {
    source = "../../modules/resource-groups"
    resource_groups = var.rgs
}

module "vnet" {
    source = "../../modules/vnet"
    vents = var.vnets
    subnets = var.subnets
}

module "nsg" {
    source = "../../modules/nsg"
    nsgs = var.nsgs
}

module "vm" {
    source = "../../modules/vm"
    vms = var.vms
}