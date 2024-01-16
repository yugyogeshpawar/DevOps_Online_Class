module "resource_group" {
  source = "../../modules/1.resource-group"
  rgs    = var.todoresource
}

module "virtual_network" {
  source     = "../../modules/4.virtual-network"
  vnets      = var.todoresource
  depends_on = [module.resource_group]
}

module "subnet" {
  source     = "../../modules/5.subnet"
  subnets        = var.todoresource
  depends_on = [module.virtual_network]
}

module "nic_card" {
  source     = "../../modules/8.nic-card"
  nics        = var.todoresource
  depends_on = [module.subnet]
}

module "nsg" {
  source     = "../../modules/9.nsg"
  nsgs        = var.todoresource
  depends_on = [module.nic_card]  
}

module "nsg_association" {
  source     = "../../modules/10.nsgassociation"
  nsgassociation        = var.todoresource
  depends_on = [module.nsg]
  
}

module "vm" {
  source     = "../../modules/12.virtual-machine"
  vms        = var.todoresource
  depends_on = [module.nic_card]
}

module "public_ip" {
  source     = "../../modules/11.public-ip"
  ipps        = var.todoresource
  depends_on = [module.vm]
}



module "loadbalancer" {
  source     = "../../modules/14.loadbalancer"
  lbs        = var.lbs
  depends_on = [module.public_ip]
  
}

module "loadbalancer_association" {
  source     = "../../modules/15.loadbalancer-association"
  azlbassociation        = var.azlbassociation
   depends_on = [module.loadbalancer]
}

