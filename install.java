import java.io.File;

import javax.naming.NameNotFoundException;
import javax.swing.text.View;

import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageParser;
import android.net.Uri;
import android.os.Bundle;

public class installer {
    private static final String TAG = "PackageInstaller";
    private Uri mPackageURI;
    PackageManager mPm;
    PackageParser.Package mPkgInfo;
    ApplicationInfo mSourceInfo;

    @Override
    public Dialog onCreateDialog(int id, Bundle bundle) {
        switch (id) {
            case DLG_REPLACE_APP:
                // update
            case DLG_UNKNOWN_APPS:
                //
            case DLG_PACKAGE_ERROR:
                // package error
            case DLG_OUT_OF_SPACE:
                // out of space
            case DLG_INSTALL_ERROR:
                // error
        }
        return null;
    }

    void setPmResult(int pmResult) {
        Intent result = new Intent();
        result.putExtra(Intent.EXTRA_INSTALL_RESULT, pmResult);
        setResult(pmResult == PackageManager.INSTALL_SUCCEEDED ? RESULT_OK : RESULT_FIRST_USER, result);
    }

    @Override
    protected void onCreate(Bundle icicle) {
        super.onCreate(icicle);
        // get intent information
        final Intent intent = getIntent();
        mPackageURI = intent.getData();
        mPm = getPackageManager();
        final String scheme = mPackageURI.getScheme();
        if (scheme != null && !"file".equals(scheme)) {
            throw new IllegalArgumentException("unexpected scheme " + scheme);
        }
        final File sourceFile = new File(mPackageURI.getPath());
        mPkgInfo = PackageUtil.getPackageInfo(sourceFile);
        // Check for parse errors
        if (mPkgInfo == null) {
            Log.w(TAG, "Parse error when parsing manifest. Discontinuing installation");
            showDialogInner(DLG_PACKAGE_ERROR);
            setPmResult(PackageManager.INSTALL_FAILED_INVALID_APK);
            return;
        }
        PackageUtil.initSnippetForNewApp(this, as, R.id.app_snippet);
        // Deal with install source.
        String callerPackage = getCallingPackage();
        // Check unknown sources.
        if (!isInstallingUnknownAppsAllowed()) {
            // ask user to enable setting first
            showDialogInner(DLG_UNKNOWN_APPS);
            return;
        }
        String pkgName = mPkgInfo.packageName;
        // Check if there is already a package on the device with this name
        // but it has been renamed to something else.
        String[] oldName = mPm.canonicalToCurrentPackageNames(new String[] { pkgName });
        if (oldName != null && oldName.length > 0 && oldName[0] != null) {
            pkgName = oldName[0];
            mPkgInfo.setPackageName(pkgName);
        }
        // Check if package is already installed. display confirmation dialog if
        // replacing pkg
        try {
            mAppInfo = mPm.getApplicationInfo(pkgName, PackageManager.GET_UNINSTALLED_PACKAGES);
        } catch (NameNotFoundException e) {
            mAppInfo = null;
        }
        if (mAppInfo == null || getIntent().getBooleanExtra(Intent.EXTRA_ALLOW_REPLACE, false)) {
            if (mPkgInfo != null) {
                AppSecurityPermissions asp = new AppSecurityPermissions(this, mPkgInfo);
                if (asp.getPermissionCount() > 0) {
                    securityList.addView(asp.getPermissionsView());
                }
            }
        } else {
            Log.i(TAG, "Replacing existing package:" + mPkgInfo.applicationInfo.packageName);
            showDialogInner(DLG_REPLACE_APP);
        }

        Intent newIntent = new Intent();
        newIntent.putExtra(PackageUtil.INTENT_ATTR_APPLICATION_INFO, mPkgInfo.applicationInfo);
        newIntent.setData(mPackageURI);
        String installerPackageName = getIntent().getStringExtra(Intent.EXTRA_INSTALLER_PACKAGE_NAME);
        if (installerPackageName != null) {
            newIntent.putExtra(Intent.EXTRA_INSTALLER_PACKAGE_NAME, installerPackageName);
        }
        if (getIntent().getBooleanExtra(Intent.EXTRA_RETURN_RESULT, false)) {
            newIntent.putExtra(Intent.EXTRA_RETURN_RESULT, true);
            newIntent.addFlags(Intent.FLAG_ACTIVITY_FORWARD_RESULT);
        }
        Log.i(TAG, "downloaded app uri=" + mPackageURI);
        startActivity(newIntent);
    }
}