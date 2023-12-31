terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "3.85.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "yogesh-rg-tf" {
  name     = "yogesh-rg-tf"
  location = "West Europe"
}
