# Authenticate to Azure CLI
az login

# Set the desired subscription
az account set --subscription "ca7e3013-59cf-4649-977d-3559e7b9f773"

# Retrieve a list of all VMs in the subscription
$vms = az vm list --query "[?tags.Environment == 'Development'].name" --output tsv

# Iterate over each VM
foreach ($vm in $vms) {
    $vmName = $VM01
    $resourceGroup = $Havenlook
    $tags = $Environment

    # Check if the VM has specific tags
    if (-not $tags -or -not $tags.Environment) {
        Write-Host "VM $vmName in resource group $resourceGroup have the 'Environment' tag. Skipping..."
    } 
    # Check if the VM tags are null or if the 'Environment' tag is missing
# if (-not $tags -or -not $tags.ContainsKey("Environment")) {
#     Write-Host "VM $vmName in resource group $resourceGroup does not have the 'Environment' tag. Skipping..."
# }

    else {
        $environment = $tags.Environment

        # Perform operations based on environment tag
        switch ($environment) {
            "Development" {
                Write-Host "Stopping VM $vmName in resource group $resourceGroup (Development environment)..."
                az vm stop --name $vmName --resource-group $resourceGroup 
               
            }
            "Staging" {
                Write-Host "Deallocating VM $vmName in resource group $resourceGroup (Staging environment)..."
                az vm deallocate --name $vmName --resource-group $resourceGroup 
                
            }
            "Production" {
                Write-Host "Skipping VM $vmName in resource group $resourceGroup (Production environment)..."
                
            }
            # Default {
            #     Write-Host "Unknown environment '$environment' for VM $vmName in resource group $resourceGroup. Skipping..."
            #     break
            # }
        }
    }
}
# # Iterate over each VM
# foreach ($vm in $vms) {
#     $vmName = $vm.Name
#     $resourceGroup = $vm.ResourceGroup
#     $tags = $vm.Tags

#     # Check if the VM tags are null or if the 'Environment' tag is missing
#     if (-not $tags -or -not $tags.ContainsKey("Environment")) {
#         Write-Host "VM $vmName in resource group $resourceGroup does not have the 'Environment' tag. Skipping..."
#         continue  # Skip to the next iteration
#     }

#     # Retrieve the environment from tags
#     $environment = $tags.Environment

#     # Perform operations based on environment tag
#     switch ($environment) {
#         "Development" {
#             Write-Host "Stopping VM $vmName in resource group $resourceGroup (Development environment)..."
#             az vm stop --name $vmName --resource-group $resourceGroup --no-wait --yes
#             break
#         }
#         "Staging" {
#             Write-Host "Deallocating VM $vmName in resource group $resourceGroup (Staging environment)..."
#             az vm deallocate --name $vmName --resource-group $resourceGroup --no-wait --yes
#             break
#         }
#         "Production" {
#             Write-Host "Skipping VM $vmName in resource group $resourceGroup (Production environment)..."
#             break
#         }
#         Default {
#             Write-Host "Unknown environment '$environment' for VM $vmName in resource group $resourceGroup. Skipping..."
#             break
#         }
#     }
# }

# # # Authenticate to Azure CLI
# az login

# # # Set the desired subscription
# az account set --subscription "ca7e3013-59cf-4649-977d-3559e7b9f773"
# # Retrieve a list of all VMs in the subscription
# $vms = az vm list --query "[].{Name:name, ResourceGroup:resourceGroup, Tags:tags}" --output tsv 

# # Iterate over each VM
# foreach ($vm in $vms) {
#     $vmName = $VM01
#     $resourceGroup = $Havenlook
#     $tags = $Environment

#     $environment = $tags.Environment

#     # Perform operations based on environment tag
#     switch ($environment) {
#         "Development" {
#             Write-Host "Stopping VM $vmName in resource group $resourceGroup (Development environment)..."
#             az vm stop --name $vmName --resource-group $resourceGroup --no-wait --yes
#             break
#         }
#         "Staging" {
#             Write-Host "Deallocating VM $vmName in resource group $resourceGroup (Staging environment)..."
#             az vm deallocate --name $vmName --resource-group $resourceGroup --no-wait --yes
#             break
#         }
#         "Production" {
#             Write-Host "Skipping VM $vmName in resource group $resourceGroup (Production environment)..."
#             break
#         }
#     }
# }
