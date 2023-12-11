
terraform {
  backend "azurerm" {
    resource_group_name   = "Yogesh_Manual_RG"
    storage_account_name  = "manualforbackendtf"
    container_name        = "backendofterraform"
    key                   = "terraform.tfstate"
  }
}
