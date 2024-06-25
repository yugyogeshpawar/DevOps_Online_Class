## Question 1: Write VM code without registry in terraform with azure provider.

```terraform



resource "azurerm_linux_virtual_machine" "linux_vms"{
    for_each = var.vms
    name = each.value.vmname
    location = each.value.location
    resource_group_name = each.value.resource_group_name
    size = each.value.vmsize
    admin_username = data.azurerm_key_vault.username[each.key].value
    admin_password = data.azurerm_key_vault.userpassword[each.key].value
    network_interface_ids = [
        azurerm_network_interface.example.id,
    ]
    os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

}

```

## Question 2: Explain app services.

Answer: App services are used to host web apps. it is a pass service. which provides us high availability, security, performance and easy deployment.
        types:
            1. Web Apps
            2. API Apps
            3. Mobile Apps
            4. Function Apps
            5. App Service Environment (ASE):
            6. Static Web Apps:
            and more.


## Question 3: Write deployment pipeline for an application on webapp.


# azure-pipelines.yml
```terraform

trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '10.x'
  displayName: 'Install Node.js'

- script: |
    npm install
    npm run build
  displayName: 'npm install and build'

- task: ArchiveFiles@2
  inputs:
    rootFolderOrFile: '$(System.DefaultWorkingDirectory)'
    includeRootFolder: false
    archiveType: zip
    archiveFile: $(Build.ArtifactStagingDirectory)/drop.zip
    replaceExistingArchive: true

- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: $(Build.ArtifactStagingDirectory)
    ArtifactName: drop
    publishLocation: Container

- task: AzureRmWebAppDeployment@4
  inputs:
    ConnectionType: 'AzureRM'
    azureSubscription: '<YourServiceConnection>'
    WebAppName: '<YourAppName>'
    packageForLinux: $(Build.ArtifactStagingDirectory)/drop.zip


- task: AzureWebApp@1
  inputs:
    azureSubscription: '<YourServiceConnection>'
    appType: webAppLinux
    appName: '<YourAppName>'
    package: $(Build.ArtifactStagingDirectory)/drop/
    runtimeStack: 'JAVA|11-java11'
    runtimeVersion: 'latest'
    slotName: 'production' 

```