module "resource_group" {
  source = "../../modules/1.resource-group"
  rgs    = var.todoresource
}

output "location" {
  value = module.resource_group.location
}

module "virtual_network" {
  source     = "../../modules/4.virtual-network"
  vnets      = var.vnets
  locations = module.resource_group.location
  depends_on = [module.resource_group]
}

module "subnet" {
  source     = "../../modules/5.subnet"
  subnets    = var.subnets
  depends_on = [module.virtual_network, module.resource_group]
}

module "nic_card" {
  source     = "../../modules/8.nic-card"
  nics       = var.nics
  subnets    = module.subnet.subnets
  depends_on = [module.subnet, module.resource_group, module.virtual_network]
}


module "nsg" {
  source     = "../../modules/9.nsg"
  nsgs       = var.nsgs
  depends_on = [module.nic_card]
}

module "nsg_association" {
  source         = "../../modules/10.nsgassociation"
  nsgassociation = var.nsgassociation
  depends_on     = [module.nsg]
}

module "vm" {
  source     = "../../modules/12.virtual-machine"
  vms        = var.vms
  nics       = module.nic_card.nic_ids
  depends_on = [module.nic_card]
}

module "public_ip" {
  source     = "../../modules/11.public-ip"
  ipps       = var.publicips
  depends_on = [module.vm]
}


module "bastion" {
  source     = "../../modules/13.bastion"
  basion     = var.basion
  depends_on = [module.resource_group, module.public_ip, module.subnet]

}

module "loadbalancer" {
  source     = "../../modules/14.loadbalancer"
  lbs        = var.lbs
  depends_on = [module.public_ip]
}


module "loadbalancer_association" {
  source          = "../../modules/15.loadbalancer-association"
  azlbassociation = var.azlbassociation
  depends_on      = [module.loadbalancer]
  nics            = module.nic_card
}

module "azappgateway" {
  source      = "../../modules/17.application-gateway"
  appgateways = var.appgateways
  depends_on  = [module.vm, module.public_ip]
}

module "azappgatewayassociation" {
  source                 = "../../modules/18.application-gateway-association"
  appgatewaysassociation = var.azappassociation
  depends_on             = [module.azappgateway]
  nics                   = module.nic_card
}

module "aks" {
  source     = "../../modules/20.aks"
  aks        = var.aks
  depends_on = [module.resource_group]
  
}

