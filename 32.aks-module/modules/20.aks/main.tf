resource "azurerm_kubernetes_cluster" "example" {
  for_each            = var.aks
  name                = each.value.aksname
  location            = each.value.location
  resource_group_name = each.value.rgname
  dns_prefix          = each.value.aksdns

  default_node_pool {
    name       = each.value.poolname
    node_count = each.value.capacity
    vm_size    = each.value.vmsize

    // Omitted availability_zones for the default to no specific zone

  }

  identity {
    type = "SystemAssigned"
  }

  sku_tier = each.value.skutier
}
