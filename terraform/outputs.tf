output "backend_url" {
  value = "https://${azurerm_linux_web_app.backend.default_hostname}"
}
output "frontend_url" {
  value = azurerm_storage_account.frontend.primary_web_endpoint
}
output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

