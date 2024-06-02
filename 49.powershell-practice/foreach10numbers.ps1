# # Initialize sum variable
# $Sum = 0

# # Array to store 10 numbers
# $numbers = @()

# # Take input for 10 numbers and calculate sum
# foreach ($i in 1..10) {
#     $number = Read-Host "Enter number $i"
#     $number = [int]$number
#     $numbers.GetType()
#     $Sum = $Sum + $number
# }


# # Print the sum
# Write-Host "Sum = $Sum"

# # Check conditions and print appropriate message
# if ($Sum -gt 100) {
#     Write-Host "mai shaktimaan hu"
# } else {
#     Write-Host "mai gangadhar hu"
# }



# Initialize sum variable
$Sum = 0

# Array to store 10 numbers
$numbers = @()

# Take input for 10 numbers and calculate sum
foreach ($i in 1..10) {
    $number = Read-Host "Enter number $i"
    $number = [int]$number
    $numbers.GetType()
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
