Initialize sum variable
$Sum = 0

# Take input for 10 numbers and calculate sum
for ($i = 1; $i -le 10; $i=$i+1) {
    $number = Read-Host "Enter number $i"
    $number = [int]$number
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
