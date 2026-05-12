param(
  [string]$IdCardImage = "ID-Card-Detection/images/sift_template.jpg",
  [string]$AttendanceImage = "backend/prisma/data/personal_images/personal_image_male.jpg"
)

$ErrorActionPreference = 'Stop'

function Get-Json([string]$Url) {
  return curl.exe -s $Url
}

Write-Host "Backend health:"
Get-Json "http://localhost:3000/api/health"

Write-Host "`nUnified services health:"
Get-Json "http://localhost:3000/api/health/services"

Write-Host "`nID card detection test:"
curl.exe -s -X POST "http://localhost:8000/check-egyptian-id/" -F "file=@$IdCardImage"

Write-Host "`nAttendance status:"
Get-Json "http://localhost:8001/status"

if (Test-Path $AttendanceImage) {
  Write-Host "`nAttendance photo validation:"
  curl.exe -s -X POST "http://localhost:8001/validate-photo" -F "file=@$AttendanceImage"
} else {
  Write-Host "`nAttendance photo validation skipped: image not found at $AttendanceImage"
}