terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_service_plan" "app_plan" {
  name                = "${var.project_name}-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "backend" {
  name                = "${var.project_name}-backend"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.app_plan.id

  site_config {
    application_stack {
      java_server        = "JAVA"
      java_server_version = "17"
      java_version        = "17"
    }
  }

  app_settings = {
    SPRING_DATA_MONGODB_URI = "mongodb+srv://${var.mongodb_username}:${var.mongodb_password}@${var.mongodb_cluster}.mongodb.net/${var.mongodb_database}?retryWrites=true&w=majority"
    JWT_SECRET              = var.jwt_secret
    SPRING_PROFILES_ACTIVE  = "prod"
    WEBSITES_PORT           = "3000"
  }
}

resource "azurerm_storage_account" "frontend" {
  name                     = "eventhubfrontend"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  static_website {
    index_document     = "index.html"
    error_404_document = "index.html"
  }
}