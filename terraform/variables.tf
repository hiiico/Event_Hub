variable "project_name" {
  default = "eventhub"
}

variable "resource_group_name" {
  default = "eventhub-rg"
}

# variables.tf
variable "location" {
  default = "francecentral"   # ✅ for App Service Plan + Resource Group
}

variable "mongodb_username" {
  type      = string
  sensitive = true
}

variable "mongodb_password" {
  type      = string
  sensitive = true
}

variable "mongodb_cluster" {
  type = string
}

variable "mongodb_database" {
  default = "eventHub"
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "github_repository_url" {
  type = string
}

variable "github_branch" {
  default = "main"
}

variable "github_token" {
  type      = string
  sensitive = true
}