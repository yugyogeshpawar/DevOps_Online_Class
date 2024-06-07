# Initialize sum variable
$Sum = 0

# Hashtable to store numbers entered by the user
$numbers = @{}



# Take input for 10 numbers and calculate sum
for ($i = 0; $i -le 10; $i=$i+1) {
    $number = Read-Host "Enter number $i"
    $number = [int]$number
    $numbers= $numbers + $number
    $Sum = $Sum + $number
}

# Print the sum
Write-Host "Sum = $Sum"

# Check conditions and print appropriate message
if ($Sum -gt 100) {
    Write-Host "mai shaktimaan hu"
} else {
    Write-Host "mai gangadhar hu"
}
