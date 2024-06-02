# $salaries = 22, 50, 10, 82, 12, 99, 80
   
# $names = "Pradeep", "Prince", "Dhanajay", "Abhishek", "Deepak", "Divyansh", "Somesh"

# $index = 0
# foreach ($mumbai_ka_don in $names) {

#     Write-Host "Aaj ka mumbai ka don: $mumbai_ka_don. Income: $($salaries[$index]) Lakh Mahina"

#     $index = $index + 1
# } 


$salaries = 22, 50, 10, 82, 12, 99, 80
$names = "Pradeep", "Prince", "Dhanajay", "Abhishek", "Deepak", "Divyansh", "Somesh"

foreach ($index in 0..($names.Length - 1)) {
    $mumbai_ka_don = $names[$index]

    if ($index -lt $salaries.Length) {
        $salary = $salaries[$index]
        Write-Host "Aaj ka mumbai ka don: $mumbai_ka_don. Income: $($salary) Lakh Mahina"
    } else {
        Write-Host "Aaj ka mumbai ka don: $mumbai_ka_don. Income: Salary data not available"
    }
}
