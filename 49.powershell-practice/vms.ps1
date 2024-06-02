# # Authenticate to Azure CLI
# az login

# Set the desired subscription
az account set --subscription "ca7e3013-59cf-4649-977d-3559e7b9f773"

# # Show details of the current subscription
# az account show

# Get resource group names of VMs with specific tag value
az.cmd resource list --query "[?contains(tags,'microsoft.compute/virtualmachines')].resourceGroup" --output tsv

$rgs = az resource list --query "[?contains(tags,'microsoft.compute/virtualmachines')].resourceGroup" --output tsv 

foreach ($resourceGroup in $rgs) {
    # Retrieve VMs in each resource group with 'Development' environment tag
    $developmentVms = az vm list --resource-group $resourceGroup --query "[?tags.Environment == 'Development'].name" --output tsv

    # Iterate over each VM in the 'Development' environment
    foreach ($vmName in $developmentVms) {
        Write-Host "Stopping VM $vmName in resource group $resourceGroup (Development environment)..."
        az vm stop --name $vmName --resource-group $resourceGroup --no-wait --yes
    }

    # Retrieve VMs in each resource group with 'Staging' environment tag
    $stagingVms = az vm list --resource-group $resourceGroup --query "[?tags.Environment == 'Staging'].name" --output tsv

    # Iterate over each VM in the 'Staging' environment
    foreach ($vmName in $stagingVms) {
        Write-Host "Deallocating VM $vmName in resource group $resourceGroup (Staging environment)..."
        az vm deallocate --name $vmName --resource-group $resourceGroup --no-wait --yes
    }

    # Retrieve VMs in each resource group with 'Production' environment tag
    $productionVms = az vm list --resource-group $resourceGroup --query "[?tags.Environment == 'Production'].name" --output tsv

    # Iterate over each VM in the 'Production' environment
    foreach ($vmName in $productionVms) {
        Write-Host "Skipping VM $vmName in resource group $resourceGroup (Production environment)..."
    }
}



# # List available subscriptions for the logged-in account
# az account list

# # Show details of the current subscription
# az account show

# # Authenticate to Azure CLI
# az login

# # Set the desired subscription
# az account set --subscription "ca7e3013-59cf-4649-977d-3559e7b9f773"

# # Get resource group names of VMs with specific tag value
# # $rgs = az resource list --query "[?tags['TagName'] == 'TagValue' && type == 'Microsoft.Compute/virtualMachines'].resourceGroup" --output tsv
# $rgs = az resource list --query "[?tags['TagName'] == 'TagValue' && type == 'Microsoft.Compute/virtualMachines'].resourceGroup" --output tsv

# foreach ($resourceGroup in $rgs) {
#     # Retrieve VMs in each resource group with 'Development' environment tag
#     $vms = az vm list --resource-group $resourceGroup --query "[?tags.Environment == 'Development'].name" --output tsv

#     # Iterate over each VM
#     foreach ($vmName in $vms) {
#         Write-Host "Stopping VM $vmName in resource group $resourceGroup (Development environment)..."
#         az vm stop --name $vmName --resource-group $resourceGroup --no-wait --yes
#     }

#     # Retrieve VMs in each resource group with 'Staging' environment tag
#     $vms = az vm list --resource-group $resourceGroup --query "[?tags.Environment == 'Staging'].name" --output tsv

#     # Iterate over each VM
#     foreach ($vmName in $vms) {
#         Write-Host "Deallocating VM $vmName in resource group $resourceGroup (Staging environment)..."
#         az vm deallocate --name $vmName --resource-group $resourceGroup --no-wait --yes
#     }

#     # Retrieve VMs in each resource group with 'Production' environment tag
#     $vms = az vm list --resource-group $resourceGroup --query "[?tags.Environment == 'Production'].name" --output tsv

#     # Iterate over each VM
#     foreach ($vmName in $vms) {
#         Write-Host "Skipping VM $vmName in resource group $resourceGroup (Production environment)..."
#         # No action required for Production environment
#     }
# }
