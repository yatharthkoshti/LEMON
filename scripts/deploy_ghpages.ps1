$code = @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class CredManager {
    [DllImport("advapi32.dll", EntryPoint = "CredReadW", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);

    [DllImport("advapi32.dll", EntryPoint = "CredFree", SetLastError = true)]
    public static extern void CredFree(IntPtr cred);

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct CREDENTIAL {
        public int Flags;
        public int Type;
        public string TargetName;
        public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }

    public static string GetUtf8Secret(string target) {
        IntPtr credPtr;
        if (CredRead(target, 1, 0, out credPtr)) {
            CREDENTIAL cred = (CREDENTIAL)Marshal.PtrToStructure(credPtr, typeof(CREDENTIAL));
            byte[] b = new byte[cred.CredentialBlobSize];
            Marshal.Copy(cred.CredentialBlob, b, 0, cred.CredentialBlobSize);
            CredFree(credPtr);
            return Encoding.UTF8.GetString(b);
        }
        return null;
    }
}
"@

Add-Type -TypeDefinition $code

$token = [CredManager]::GetUtf8Secret("LegacyGeneric:target=GitHub - https://api.github.com/yatharthkoshti")
if (-not $token) {
    $token = [CredManager]::GetUtf8Secret("LegacyGeneric:target=GitHub - https://api.github.com/simplytoxik")
}

if (-not $token) {
    Write-Error "Could not retrieve GitHub token."
    exit 1
}

# 1. First ensure dist is fresh
npm run build

# 2. Check if dist exists
if (-not (Test-Path "d:\1LATEST\dist\index.html")) {
    Write-Error "dist/index.html not found!"
    exit 1
}

# 3. Create .nojekyll in dist so GitHub Pages does not ignore files
New-Item -ItemType File -Force -Path "d:\1LATEST\dist\.nojekyll" | Out-Null

# 4. Copy dist/index.html to dist/404.html for SPA routing on GitHub Pages
Copy-Item "d:\1LATEST\dist\index.html" -Destination "d:\1LATEST\dist\404.html" -Force

# 5. Push dist to gh-pages branch
$tempDir = Join-Path $env:TEMP "lemon-gh-pages"
if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

Copy-Item -Path "d:\1LATEST\dist\*" -Destination $tempDir -Recurse -Force

git -C $tempDir init
git -C $tempDir branch -M gh-pages
git -C $tempDir add -A
git -C $tempDir -c user.name="yatharth koshti" -c user.email="koshtiyatharth7777@gmail.com" commit -m "deploy: publish to GitHub Pages"
git -C $tempDir remote add origin "https://x-access-token:$($token)@github.com/yatharthkoshti/LEMON.git"
git -C $tempDir push -u origin gh-pages --force

Remove-Item -Recurse -Force $tempDir

# Also push main branch with updated vite.config.ts base './'
git add vite.config.ts
git -c user.name="yatharth koshti" -c user.email="koshtiyatharth7777@gmail.com" commit -m "fix: set base to relative for universal hosting and tunnels"
git remote set-url origin "https://x-access-token:$($token)@github.com/yatharthkoshti/LEMON.git"
git push origin main
git remote set-url origin "https://github.com/yatharthkoshti/LEMON.git"

Write-Host "SUCCESS: Deployed to gh-pages branch!"
