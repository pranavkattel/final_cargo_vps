# PowerShell script to update gradient colors to smoke grey scheme

$files = Get-ChildItem -Path "src" -Filter "*.tsx" -Recurse

$gradientMappings = @{
    # Gradient classes
    'from-blue-50' = 'from-smoke-light'
    'to-blue-50' = 'to-smoke-light'
    'from-blue-100' = 'from-smoke-medium'
    'to-blue-100' = 'to-smoke-medium'
    'from-blue-200' = 'from-primary-blue'
    'to-blue-200' = 'to-primary-blue'
    'from-blue-500' = 'from-accent-orange'
    'to-blue-500' = 'to-accent-orange'
    'from-blue-600' = 'from-smoke-dark'
    'to-blue-600' = 'to-smoke-dark'
    'from-blue-700' = 'from-accent-orange-hover'
    'to-blue-700' = 'to-accent-orange-hover'
    'from-blue-800' = 'from-accent-orange-hover'
    'to-blue-800' = 'to-accent-orange-hover'
    'from-blue-900' = 'from-smoke-darker'
    'to-blue-900' = 'to-smoke-darker'
    'via-blue-800' = 'via-accent-orange-hover'
    
    'hover:from-blue-700' = 'hover:from-accent-orange-hover'
    'hover:to-blue-800' = 'hover:to-accent-orange-hover'
    
    # Specific inline gradient patterns
    "linear-gradient\(to right, #14344D, #3F6F8F\)" = "linear-gradient(to right, #2D3748, #4A5568)"
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($old in $gradientMappings.Keys) {
        $new = $gradientMappings[$old]
        if ($old -like "*linear-gradient*") {
            $content = $content -replace $old, $new
        } else {
            $content = $content -replace [regex]::Escape($old), $new
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated gradients: $($file.Name)"
    }
}

Write-Host "`nGradient update complete!"
