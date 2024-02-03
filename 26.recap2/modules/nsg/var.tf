variable "nsgs" {
  type = map(
    object({
      nsgname  = string
      location = string
      rgname   = string
    })
  )
  default = {}
}
  
