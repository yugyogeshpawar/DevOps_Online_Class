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

output "nic_ids" {
  value = { for k, v in azurerm_network_interface.nic : v.name => v.id }
}


# lookup(var.nics,)


# {
#   front-todo-nic: "askdf;ljaksd;fjsfn;askjdfioashldifj",
#   front-todo-nic2:"a;isjd;flkjaw;eoirj;oiqjr13j4;lk123n4kjn123kj4n12kj34n1235jn13kjn54k34",
#   ....
#   ....
#   ....
# }