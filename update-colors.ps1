# PowerShell script to update all colors to smoke grey scheme
# 60-30-10 Rule: Light Grey 60%, Medium Grey 30%, Dark Grey 10%

$files = Get-ChildItem -Path "src" -Filter "*.tsx" -Recurse

$colorMappings = @{
    # Blue shades to grey shades
    'bg-blue-50' = 'bg-smoke-light'
    'bg-blue-100' = 'bg-smoke-medium'
    'bg-blue-200' = 'bg-primary-blue'
    'bg-blue-300' = 'bg-primary-blue'
    'bg-blue-400' = 'bg-accent-orange'
    'bg-blue-500' = 'bg-accent-orange'
    'bg-blue-600' = 'bg-smoke-dark'
    'bg-blue-700' = 'bg-accent-orange-hover'
    'bg-blue-800' = 'bg-accent-orange-hover'
    'bg-blue-900' = 'bg-smoke-darker'
    
    'text-blue-50' = 'text-gray-100'
    'text-blue-100' = 'text-gray-200'
    'text-blue-200' = 'text-gray-300'
    'text-blue-300' = 'text-gray-400'
    'text-blue-400' = 'text-primary-blue'
    'text-blue-500' = 'text-primary-blue'
    'text-blue-600' = 'text-accent-orange'
    'text-blue-700' = 'text-smoke-dark'
    'text-blue-800' = 'text-smoke-dark'
    'text-blue-900' = 'text-smoke-darker'
    
    'border-blue-50' = 'border-smoke-light'
    'border-blue-100' = 'border-smoke-medium'
    'border-blue-200' = 'border-smoke-medium'
    'border-blue-300' = 'border-primary-blue'
    'border-blue-400' = 'border-primary-blue'
    'border-blue-500' = 'border-accent-orange'
    'border-blue-600' = 'border-accent-orange'
    'border-blue-700' = 'border-smoke-dark'
    'border-blue-800' = 'border-smoke-dark'
    'border-blue-900' = 'border-smoke-darker'
    
    'hover:bg-blue-50' = 'hover:bg-smoke-light'
    'hover:bg-blue-400' = 'hover:bg-primary-blue'
    'hover:bg-blue-600' = 'hover:bg-accent-orange'
    'hover:bg-blue-700' = 'hover:bg-accent-orange-hover'
    'hover:bg-blue-800' = 'hover:bg-accent-orange-hover'
    
    'hover:text-blue-600' = 'hover:text-accent-orange'
    'hover:text-blue-800' = 'hover:text-smoke-dark'
    'hover:text-blue-900' = 'hover:text-smoke-darker'
    
    'hover:border-blue-300' = 'hover:border-primary-blue'
    
    'ring-blue-300' = 'ring-accent-orange'
    'ring-blue-500' = 'ring-accent-orange'
    'focus:ring-blue-300' = 'focus:ring-accent-orange'
    'focus:ring-blue-500' = 'focus:ring-accent-orange'
    
    'peer-checked:bg-blue-600' = 'peer-checked:bg-accent-orange'
    
    # Orange shades to grey shades
    'bg-orange-100' = 'bg-smoke-medium'
    'bg-orange-600' = 'bg-accent-orange'
    'text-orange-600' = 'text-accent-orange'
    'text-orange-800' = 'text-smoke-dark'
    'text-orange-900' = 'text-smoke-darker'
    
    # Hex colors
    '#0096C7' = '#4A5568'
    '#F9B222' = '#718096'
    '#e6a01e' = '#2D3748'
    "'#FFFFFF'" = "'#F5F5F5'"
    '"#FFFFFF"' = '"#F5F5F5"'
    'bg-white' = 'bg-primary-white'
    'text-white' = 'text-white'
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($old in $colorMappings.Keys) {
        $new = $colorMappings[$old]
        $content = $content -replace [regex]::Escape($old), $new
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "`nColor scheme update complete!"
