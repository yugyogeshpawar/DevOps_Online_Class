#take two value from the user and store in two diffrents variables and plus and print the output
#if sum is greter than 100 than print "mai shaktimaan hu"
#if sum is less than 100 than print "mai gangadhar hu"
Write-Host "............................................"
Write-Host "The sum of first_number and second_number is"
Write-Host "............................................"
$first_number = Read-Host "Enter the first number"
$second_number = Read-Host "Enter the second number"

Write-Host "............................................"
Write-Host "first no. is $first_number"
Write-Host "second no. is $second_number"
Write-Host "............................................"

# Convert input strings to numbers
$first_number = [int]$first_number
$second_number = [int]$second_number

# Add the numbers
$Sum = $first_number + $second_number
Write-Host "sum = $Sum"

if ($Sum -gt 100) {
    Write-Host "mai shaktimaan hu"
}
else
    {Write-Host "mai gangadhar hu"}








