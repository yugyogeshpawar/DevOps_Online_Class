
variable "resource_group_names" {
  description = "Name of the Azure Resource Group"
}

variable "storage_account_name" {
  description = "Name of the Azure Storage Account"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "East US"
}
