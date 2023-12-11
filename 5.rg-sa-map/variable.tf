variable "resource_groups" {
  type = map(object({
    location : string
  }))
  default = {
    yogesh_rg_1 = {
      location = "East US"
    }
    yogesh_rg_2 = {
      location = "West Europe"
    }
  }
}
