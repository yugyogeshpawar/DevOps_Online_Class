data "azurerm_subnet" "existing_subnet" {
  for_each = var.nics

  name                 = each.value.subnetname
  virtual_network_name = each.value.vnetname
  resource_group_name  = each.value.rgname
}



resource "azurerm_network_interface" "nic" {
  for_each            = var.nics
  name                = each.value.nicname
  location            = each.value.location
  resource_group_name = each.value.rgname

  ip_configuration {
    name                          = each.value.ipconfigname
    subnet_id                     = data.azurerm_subnet.existing_subnet[each.key].id
    private_ip_address_allocation = "Dynamic"
  }

  tags = {
    environment = "development"
  }
}

// write output for nic and itterate id in a variable

output "nic_ids" {
  value = { for k, v in azurerm_network_interface.nic : k => v.id }
}



# output "nics" {
#   value = {
#     for vnet_name, vnet_data in azurerm_network_interface.nic :
#     vnet_data.name => {
#       for subnet in vnet_data.subnet :
#       subnet.name => subnet.id
#     }
#   }
# }