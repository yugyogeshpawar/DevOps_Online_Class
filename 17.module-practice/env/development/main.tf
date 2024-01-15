module "resource_group" {
  source = "../../modules/1.resource-group"
  rgs    = var.rgs
}

module "virtual_network" {
  source     = "../../modules/4.virtual-network"
  rgs        = var.rgs
  depends_on = [module.resource_group]
}

module "subnet" {
  source     = "../../modules/5.subnet"
  rgs        = var.rgs
  depends_on = [module.virtual_network]
}

module "nic_card" {
  source     = "../../modules/8.nic-card"
  rgs        = var.rgs
  depends_on = [module.subnet]
}
