# Define the hosts file path
$hostsFilePath = "$env:SystemRoot\System32\drivers\etc\hosts"

# Define the new entry
$newEntry = "142.251.33.110 www.facebook.com"

# Read the content of the hosts file
$hostsFileContent = Get-Content -Path $hostsFilePath

# Check if the entry already exists
$entryExists = $hostsFileContent -contains $newEntry

if (-not $entryExists) {
    # Backup the original hosts file
    Copy-Item -Path $hostsFilePath -Destination "$hostsFilePath.bak"

    # Add the new entry
    Add-Content -Path $hostsFilePath -Value $newEntry

    Write-Output "The entry '$newEntry' has been added to the hosts file."
} else {
    Write-Output "The entry '$newEntry' already exists in the hosts file."
}
