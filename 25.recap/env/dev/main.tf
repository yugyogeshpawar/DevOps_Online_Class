module "rgs" {
    source = "../../modules/resource-group"
    rgs = var.resources
    tags = var.tags
}

module "vnets" {
    source = "../../modules/vnet"
    vnets = var.vnets
    depends_on = [ module.rgs ]
    tags = var.tags
}

module "keyvault" {
    source = "../../modules/key-vault"
    keyvault = var.keyvault
    depends_on = [ module.rgs ]
    tags = var.tags
}

module "subnetsblock" {
    source = "../../modules/subnet"
    subnets = var.subnets
    depends_on = [ module.vnets ]
    tags = var.tags
}

module "linux_virtual_machine" {
    source = "../../modules/vm"
    vms = var.vms
    depends_on = [ module.subnetsblock ]
    tags = var.tags
}

