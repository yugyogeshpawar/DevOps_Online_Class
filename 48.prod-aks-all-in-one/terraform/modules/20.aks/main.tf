

resource "azurerm_kubernetes_cluster" "aks" {
  for_each            = var.aks
  name                = each.value.aksname
  location            = each.value.location
  resource_group_name = each.value.rgname
  dns_prefix          = each.value.aksdns

  # kubernetes_version = each.value.k8sversion
  # automatic_channel_upgrade = "stable"
  # private_cluster_enabled = false
  # node_resource_group = each.value.aksnodegroup

  # oidc_issuer_enabled = true
  # workload_identity_enabled = true

  # network_profile {
  #   network_plugin = each.value.networkplugin
  #   dns_service_ip = "89.207.132.170"
  #   service_cidr = "89.207.132.170/16"
  # }
  

  default_node_pool {
    name       = each.value.poolname
    node_count = each.value.capacity
    vm_size    = each.value.vmsize
    # type = "VirtualMachineScaleSets"
    # vnet_subnet_id = each.value.subnetid
    # enable_auto_scaling = true 
    # min_count = 1  
    # max_count = 3
    # max_pods = 30


    # node_labels = {
    #   role = "worker"
    # }
  }

  identity {
    type = "SystemAssigned"
  }

  sku_tier = each.value.skutier
}
