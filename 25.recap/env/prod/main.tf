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