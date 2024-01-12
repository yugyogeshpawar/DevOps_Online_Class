resource "azurerm_resource_group" "testing-rg" {
    for_each = var.vms
  name = "testing-rg"
  location = "eastus"

  tags = {
    Environment = "Terraform Getting Started"
    Team = "DevOps"
  }
}


