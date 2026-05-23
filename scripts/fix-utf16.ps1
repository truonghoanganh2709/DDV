$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding $false
$extensions = @('*.js', '*.jsx', '*.html', '*.css', '*.json', '*.md')

Get-ChildItem -Path $root -Recurse -File -Include $extensions |
  Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
  ForEach-Object {
    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    if ($bytes.Length -lt 2) { return }

    $isUtf16 = $false
    if ($bytes[0] -eq 0xFF -and $bytes[1] -eq 0xFE) { $isUtf16 = $true }
    elseif ($bytes[0] -eq 0xFE -and $bytes[1] -eq 0xFF) { $isUtf16 = $true }
    elseif ($bytes[0] -eq 0x7B -and $bytes[1] -eq 0x00) { $isUtf16 = $true }
    elseif ($bytes[0] -eq 0x3C -and $bytes[1] -eq 0x00) { $isUtf16 = $true }
    elseif ($bytes[0] -eq 0x69 -and $bytes[1] -eq 0x00) { $isUtf16 = $true }

    if (-not $isUtf16) { return }

    $text = [System.Text.Encoding]::Unicode.GetString($bytes)
    [System.IO.File]::WriteAllText($_.FullName, $text, $utf8)
    Write-Host "Fixed UTF-16: $($_.FullName)"
  }

Write-Host 'Done.'
