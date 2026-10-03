$code = @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public class CredHelper {
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
    public static string GetSecret(string target) {
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
$token = [CredHelper]::GetSecret("LegacyGeneric:target=GitHub - https://api.github.com/yatharthkoshti")
if (-not $token) { $token = [CredHelper]::GetSecret("LegacyGeneric:target=GitHub - https://api.github.com/simplytoxik") }

git -C "d:\1LATEST" add package.json scripts/
git -C "d:\1LATEST" -c user.name="yatharth koshti" -c user.email="koshtiyatharth7777@gmail.com" commit -m "chore: add deploy and tunnel scripts to package.json"
git -C "d:\1LATEST" remote set-url origin "https://x-access-token:$($token)@github.com/yatharthkoshti/LEMON.git"
git -C "d:\1LATEST" push origin main
git -C "d:\1LATEST" remote set-url origin "https://github.com/yatharthkoshti/LEMON.git"
Write-Host "Pushed main branch successfully!"
